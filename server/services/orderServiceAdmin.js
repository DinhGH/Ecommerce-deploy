const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getOrders = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [orders, totalOrders] = await Promise.all([
    prisma.order.findMany({
      skip,
      take: limit,
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.order.count(),
  ]);

  const totalPages = Math.ceil(totalOrders / limit);

  return { orders, totalPages };
};

const updateOrderStatus = async (orderId, status) => {
  const order = await prisma.order.update({
    where: { id: Number(orderId) },
    data: { status },
  });
  return order;
};

const deleteOrder = async (orderId) => {
  await prisma.orderItem.deleteMany({
    where: { orderId: Number(orderId) },
  });

  const order = await prisma.order.delete({
    where: { id: Number(orderId) },
  });
  return order;
};

const createOrderService = async (userId, data, proofImage) => {
  const {
    recipientName,
    recipientEmail,
    recipientPhone,
    altRecipientName,
    altRecipientPhone,
    houseNumber,
    street,
    ward,
    province,
    country,
    deliveryTime,
    items,
  } = data;

  // Ghép địa chỉ đầy đủ
  const fullAddress = `${houseNumber || ""}, ${street || ""}, ${ward || ""}, ${
    province || ""
  }, ${country || ""}`;

  // ✅ Parse items JSON an toàn
  let parsedItems = [];
  try {
    parsedItems = typeof items === "string" ? JSON.parse(items) : items;
  } catch (err) {
    throw new Error("Invalid items format");
  }

  if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
    throw new Error("Items must be a non-empty array");
  }

  // Tính tổng tiền
  const total = parsedItems.reduce(
    (sum, item) =>
      sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
    0
  );

  // ✅ Xoá giỏ hàng của user sau khi checkout
  await prisma.cartItem.deleteMany({
    where: {
      cart: { userId: userId },
    },
  });

  // Tạo đơn hàng
  return await prisma.order.create({
    data: {
      userId,
      total,
      recipientName,
      recipientPhone,
      recipientEmail,
      address: fullAddress || "",
      altRecipientName,
      altRecipientPhone,
      deliveryTime,
      proofImage,
      status: "PENDING",
      items: {
        create: parsedItems.map((item) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
          price: Number(item.price),
        })),
      },
    },
    include: { items: true },
  });
};

// ========== UPDATE ORDER ==========
const updateOrder = async (id, data) => {
  // lấy danh sách product từ DB
  const productIds = data.items.map((i) => Number(i.productId));
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, price: true, discountPercentage: true },
  });

  const itemsToCreate = data.items.map((i) => {
    const product = products.find((p) => p.id === Number(i.productId));
    if (!product) throw new Error(`Product not found: ${i.productId}`);

    let finalPrice = product.price;
    if (product.discountPercentage) {
      finalPrice = finalPrice * (1 - product.discountPercentage / 100);
    }

    return {
      productId: Number(i.productId),
      quantity: Number(i.quantity),
      price: finalPrice,
    };
  });

  const total = itemsToCreate.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return await prisma.order.update({
    where: { id: Number(id) },
    data: {
      recipientName: data.recipientName,
      recipientPhone: data.recipientPhone,
      recipientEmail: data.recipientEmail || null,
      address: data.address,
      altRecipientName: data.altRecipientName || null,
      altRecipientPhone: data.altRecipientPhone || null,
      deliveryTime: data.deliveryTime || null,
      proofImage: data.proofImage || null,
      total,
      status: data.status,
      items: {
        deleteMany: {}, // xoá hết items cũ
        create: itemsToCreate,
      },
    },
    include: { items: { include: { product: true } } },
  });
};

module.exports = {
  updateOrderStatus,
  getOrders,
  deleteOrder,
  createOrderService,
  updateOrder,
};
