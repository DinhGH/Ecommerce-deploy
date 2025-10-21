const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../services/userService");
const { getUser, getUserPhone } = require("../services/authService");

const bcrypt = require("bcrypt");

const { streamUpload } = require("../middlewares/cloudinary");

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await getUsers(page, limit);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createNewUser = async (req, res) => {
  try {
    const { email, phone } = req.body;

    const existing = await getUser(email);
    if (existing) {
      return res.status(400).json({ message: "Email already exis" });
    }

    const existingPhone = await getUserPhone(phone);
    if (existingPhone) {
      return res.status(400).json({ message: "Phone already exis" });
    }
    let avatar = null;

    if (req.file) {
      avatar = await streamUpload(req.file.buffer, "avatar");
    } else if (req.body.avatar) {
      avatar = req.body.avatar;
    }
    const password = req.body.password;
    const passwordHash = await bcrypt.hash(password, 10);
    const data = { ...req.body, avatar, passwordHash };
    const user = await createUser(data);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const { email, phone } = req.body;
    if (email) {
      const existing = await getUser(email);
      if (existing) {
        return res.status(400).json({ message: "Email already exis" });
      }
    }

    if (phone) {
      const existingPhone = await getUserPhone(phone);
      if (existingPhone) {
        return res.status(400).json({ message: "Phone already exis" });
      }
    }
    let avatar = null;

    if (req.file) {
      avatar = await streamUpload(req.file.buffer, "avatar");
    } else if (req.body.avatar) {
      avatar = req.body.avatar;
    }
    const password = req.body.password;
    const passwordHash = await bcrypt.hash(password, 10);
    const data = { ...req.body, passwordHash, avatar };
    const user = await updateUser(req.params.id, data);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
