const express = require("express");
const productControllerC = require("../controllers/productControllerC");
const {
  authMiddleware,
  requireRole,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", productControllerC.getProductsController);
router.get("/brands", productControllerC.getBrandsController);
router.get("/search", productControllerC.searchProducts);
router.get("/filter-brand", productControllerC.filterBrand);
router.get("/filter", productControllerC.filter);
router.get("/filter-category", productControllerC.filterCategory);
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Xin chào user", userId: req.userId, role: req.role });
});
router.get("/category", productControllerC.getCategory);

module.exports = router;
