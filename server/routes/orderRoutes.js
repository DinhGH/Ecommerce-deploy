const express = require("express");
const orderController = require("../controllers/orderController");
const upload = require("../middlewares/upload");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.single("paymentProof"),
  orderController.createOrder
);

router.get("/my-orders", authMiddleware, orderController.getOrdersByUser);
router.delete(
  "/my-orders/:id",
  authMiddleware,
  orderController.cancelOrderController
);

module.exports = router;
