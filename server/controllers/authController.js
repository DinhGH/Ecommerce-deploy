const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  createUser,
  getUser,
  getUserPhone,
  getUserById,
  forgotPassword,
  resetPassword,
  updateProfileService,
} = require("../services/authService");

const createToken = (user) => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUser(email);
    if (!user) {
      return res.status(400).json({ message: "Email is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect" });
    }
    const { password: _, ...userData } = user;
    const token = createToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true nếu dùng HTTPS
      sameSite: "lax",
    });
    return res.status(201).json({
      message: "Login successful",
      user: userData,
      role: user.role,
    });
  } catch (error) {
    console.error("Error Login: ", error);
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

exports.register = async (req, res) => {
  try {
    const { fullName, email, phone, password, address, age, gender } = req.body;
    const existing = await getUser(email);
    if (existing) {
      return res.status(400).json({ message: "Email already exis" });
    }

    const existingPhone = await getUserPhone(phone);

    if (existingPhone) {
      return res.status(400).json({ message: "Phone already exis" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await createUser({
      fullName,
      email,
      phone,
      password: passwordHash,
      address,
      age: age ? parseInt(age) : null,
      gender,
    });
    const { password: _, ...safeUser } = user;
    res.status(201).json({ user: safeUser });
  } catch (error) {
    console.error("Error register user: ", error);
  }
};

// Callback Google
exports.googleCallback = (req, res) => {
  const token = createToken(req.user);

  // In your login controllers, use consistent settings:
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in production
    sameSite: "lax", // or "strict"
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  res.redirect("http://localhost:5173/?loggedIn=true");
};

exports.getUserInfo = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await getUserById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        age: user.age,
        gender: user.gender,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ getUserInfo error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.facebookCallback = (req, res) => {
  const token = createToken(req.user);
  res.redirect(`http://localhost:5173/?token=${token}`);
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const isEmail = await getUser(email);
    if (!isEmail) {
      return res.status(400).json({ message: "Email not found!" });
    }
    await forgotPassword(email);
    res.json({ message: "Password reset link sent to your email" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await resetPassword(token, passwordHash);
    res.json({ msg: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await updateProfileService(
      req.user.userId,
      req.body,
      req.file
    );

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }
};
