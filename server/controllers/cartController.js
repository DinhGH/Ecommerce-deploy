const {
  addToCart,
  getCartItem,
  updateCartItemQuantity,
  removeCartItem,
} = require("../services/cartService");

exports.addCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: no user id" });
    }

    const result = await addToCart(userId, productId, quantity || 1);
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: no user id" });
    }

    const result = await getCartItem(userId);

    return res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không lấy được giỏ hàng" });
  }
};

exports.updateQuantity = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const updatedItem = await updateCartItemQuantity(id, quantity);
    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating cart item:", error.message);

    if (error.message.includes("not found")) {
      return res.status(404).json({ message: error.message });
    }

    if (error.message.includes("Quantity")) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await removeCartItem(id);
    res.json(result);
  } catch (error) {
    console.error("Error deleting cart item:", error.message);

    if (error.message.includes("not found")) {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};
