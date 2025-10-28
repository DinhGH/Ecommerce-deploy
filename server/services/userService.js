const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { id: "desc" },
    }),
    prisma.user.count(),
  ]);

  return {
    data,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

const createUser = async (payload) => {
  const { passwordHash, age, ...rest } = payload;

  return prisma.user.create({
    data: { ...rest, age: age ? parseInt(age) : null, password: passwordHash },
  });
};

const updateUser = async (id, payload) => {
  const { passwordHash, age, ...rest } = payload;

  const data = {
    ...rest,
    age: age ? parseInt(age) : null,
  };

  if (passwordHash) {
    data.password = passwordHash;
  }

  return prisma.user.update({
    where: { id: Number(id) },
    data,
  });
};

const deleteUser = async (id) => {
  try {
    const userId = Number(id);
    await prisma.passwordResetToken.deleteMany({ where: { userId } });
    await prisma.reportIssue.deleteMany({ where: { userId } });
    await prisma.cart.deleteMany({ where: { userId } });
    await prisma.order.deleteMany({ where: { userId } });

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    console.log("✅ Đã xóa user:", deletedUser.email || deletedUser.id);
    return deletedUser;
  } catch (error) {
    console.error("❌ Lỗi khi xóa user:", error.message);
    throw error;
  }
};

module.exports = {
  createUser,
  updateUser,
  getUsers,
  deleteUser,
};
