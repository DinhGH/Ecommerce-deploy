const express = require("express");
const orderControllerAdmin = require("../controllers/orderControllerAdmin");
const router = express.Router();
const upload = require("../middlewares/upload");

// GET all orders with pagination
router.get("/", orderControllerAdmin.getOrdersController);

// PUT update order status
router.put("/:id/status", orderControllerAdmin.updateOrderStatusController);

// DELETE order
router.delete("/:id", orderControllerAdmin.deleteOrderController);

router.post("/", upload.single("proofImage"), orderControllerAdmin.createOrder);

// PUT /api/admin/orders/:id
router.put(
  "/:id",
  upload.single("proofImage"),
  orderControllerAdmin.updateOrder
);

module.exports = router;
