const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require("crypto");
const { streamUpload } = require("../middlewares/cloudinary");

const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
  });
};

const getUser = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

const getUserPhone = async (phone) => {
  return await prisma.user.findUnique({
    where: { phone },
  });
};

const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      address: true,
      age: true,
      gender: true,
      avatar: true,
      role: true,
    },
  });
};

const forgotPassword = async (email) => {
  // 1. Tìm user trong DB
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found with this email");
  }

  // 2. Tạo token reset
  const resetToken = crypto.randomBytes(32).toString("hex");

  // 3. Lưu token vào DB (thêm bảng hoặc cột resetToken, resetExpire)
  await prisma.user.update({
    where: { email },
    data: {
      resetToken,
      resetExpire: new Date(Date.now() + 15 * 60 * 1000), // 15 phút
    },
  });

  // 4. Gửi email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

  await transporter.sendMail({
    from: '"Support" <huynhtandinh.dev@gmail.com>',
    to: email,
    subject: "Password Reset",
    text: `Click here to reset password: ${resetUrl}. Expire in 15 minutes.`,
  });
};

const resetPassword = async (token, passwordHash) => {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetExpire: { gt: new Date() }, // còn hạn
    },
  });

  if (!user) {
    throw new Error("Token invalid or expired");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: passwordHash,
      resetToken: null,
      resetExpire: null,
    },
  });

  return "Password has been reset successfully";
};

const updateProfileService = async (userId, data, file) => {
  let avatarUrl = data.avatar;

  if (file) {
    // upload ảnh mới lên Cloudinary
    avatarUrl = await streamUpload(file.buffer, "avatars");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      age: data.age ? Number(data.age) : null,
      gender: data.gender,
      avatar: avatarUrl,
    },
  });

  return updatedUser;
};

const updateRefreshToken = (userId, refreshToken) => {
  return prisma.user.update({
    where: { id: userId },
    data: { refreshToken },
  });
};

// Xoá refreshToken khi logout
const clearRefreshToken = (userId) => {
  return prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
};

module.exports = {
  createUser,
  getUser,
  getUserPhone,
  getUserById,
  forgotPassword,
  resetPassword,
  updateProfileService,
  updateRefreshToken,
  clearRefreshToken,
};
