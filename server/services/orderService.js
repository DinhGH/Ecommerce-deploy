const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createOrderService = async (userId, data, proofImage) => {
  const {
    recipientName,
    email,
    phone,
    altRecipientName,
    altPhone,
    houseNumber,
    street,
    ward,
    province,
    country,
    deliveryTime,
    items,
  } = data;

  // Ghép địa chỉ đầy đủ
  const fullAddress = `${houseNumber}, ${street}, ${ward}, ${province}, ${country}`;

  // Parse items JSON
  const parsedItems = JSON.parse(items);

  // Tính tổng tiền
  const total = parsedItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  // ✅ Xoá giỏ hàng của user sau khi checkout
  const productIdsToDelete = parsedItems.map((item) => item.productId);

  await prisma.cartItem.deleteMany({
    where: {
      cart: { userId },
      productId: { in: productIdsToDelete },
    },
  });

  // Tạo đơn hàng
  return await prisma.order.create({
    data: {
      userId,
      total,
      recipientName,
      recipientPhone: phone,
      recipientEmail: email,
      address: fullAddress,
      altRecipientName,
      altRecipientPhone: altPhone,
      deliveryTime,
      proofImage,
      status: "PENDING",
      items: {
        create: parsedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
    include: { items: true },
  });
};

const getOrdersByUserService = async (userId) => {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getAllOrdersService = async () => {
  return await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};
const cancelOrderService = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new Error("ORDER_NOT_FOUND");

  const now = new Date();
  const diffHours =
    (now.getTime() - new Date(order.createdAt).getTime()) / 1000 / 60 / 60;

  if (diffHours > 24) {
    throw new Error("EXCEEDED_24H");
  }

  const cancelledOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  });

  return cancelledOrder;
};
module.exports = {
  createOrderService,
  getAllOrdersService,
  getOrdersByUserService,
  cancelOrderService,
};
