const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const addToCart = async (userId, productId, quantity = 1) => {
  // tìm cart của user
  let cart = await prisma.cart.findFirst({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
    });
  }

  // kiểm tra item đã có trong cart chưa
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existingItem) {
    // update số lượng
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    // thêm mới
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  return { message: "Added to cart successfully" };
};

const getCartItem = async (userId) => {
  return await prisma.cartItem.findMany({
    where: {
      cart: {
        userId: userId, // lọc qua quan hệ Cart → User
      },
    },
    include: {
      product: true,
    },
  });
};

const updateCartItemQuantity = async (id, quantity) => {
  if (quantity < 1) {
    throw new Error("Quantity must be >= 1");
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: Number(id) },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  return prisma.cartItem.update({
    where: { id: Number(id) },
    data: { quantity },
    include: { product: true },
  });
};

const removeCartItem = async (id) => {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: Number(id) },
  });

  if (!cartItem) {
    throw new Error("Cart item not found");
  }

  await prisma.cartItem.delete({
    where: { id: Number(id) },
  });

  return { message: "Cart item removed successfully" };
};

module.exports = {
  addToCart,
  getCartItem,
  updateCartItemQuantity,
  removeCartItem,
};
