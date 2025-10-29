const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require("crypto");
const { streamUpload } = require("../middlewares/cloudinary");
const nodemailer = require("nodemailer");

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
  // 1️⃣ Tìm user trong DB
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found with this email");
  }

  // 2️⃣ Tạo token reset ngẫu nhiên
  const resetToken = crypto.randomBytes(32).toString("hex");

  // 3️⃣ Lưu token + hạn 15 phút vào DB
  await prisma.user.update({
    where: { email },
    data: {
      resetToken,
      resetExpire: new Date(Date.now() + 15 * 60 * 1000), // 15 phút
    },
  });

  // 4️⃣ Tạo transporter Nodemailer (qua Gmail)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // ví dụ: huynhdinh2k52707@gmail.com
      pass: process.env.EMAIL_PASS, // App password
    },
  });

  // 5️⃣ Tạo URL reset password
  const resetUrl = `${process.env.FRONT_URL}/reset-password/${resetToken}`;

  // 6️⃣ Soạn nội dung email
  const mailOptions = {
    from: `"Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request",
    text: `Click the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 15 minutes.`,
  };

  // 7️⃣ Gửi mail
  await transporter.sendMail(mailOptions);

  console.log(`✅ Password reset email sent to ${email}`);
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
