const express = require("express");
const cartController = require("../controllers/cartController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", authMiddleware, cartController.addCart);
router.get("/", authMiddleware, cartController.getCart);
router.put("/:id", authMiddleware, cartController.updateQuantity);
router.delete("/:id", authMiddleware, cartController.deleteItem);

module.exports = router;
