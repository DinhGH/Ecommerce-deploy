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
  return prisma.user.delete({ where: { id: Number(id) } });
};

module.exports = {
  createUser,
  updateUser,
  getUsers,
  deleteUser,
};
