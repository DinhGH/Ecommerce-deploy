const {
  getProducts,
  getBrands,
  searchProduct,
  filterBrandProduct,
  filterCategoryProduct,
  getCategories,
  filterAll,
} = require("../services/productServiceC");

exports.getProductsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const result = await getProducts(page, limit);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getBrandsController = async (req, res) => {
  try {
    const brands = await getBrands();
    res.json(brands);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { q, page = 1, limit = 12 } = req.query;
    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Thiếu từ khóa tìm kiếm" });
    }

    const result = await searchProduct(q, parseInt(page), parseInt(limit));
    res.json(result);
  } catch (error) {
    console.error("Search API error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.filterBrand = async (req, res) => {
  try {
    const { brand, page, limit } = req.query;

    const products = await filterBrandProduct(
      brand,
      parseInt(page),
      parseInt(limit)
    );
    res.json(products);
  } catch (error) {
    console.error("Filter By Brand error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.filterCategory = async (req, res) => {
  try {
    const { category, page, limit } = req.query;

    const products = await filterCategoryProduct(
      category,
      parseInt(page),
      parseInt(limit)
    );
    res.json(products);
  } catch (error) {
    console.error("Filter By Brand error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const category = await getCategories();
    res.json(category);
  } catch (error) {
    console.error("Error get Category: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.filter = async (req, res) => {
  try {
    const {
      priceRange,
      keyword,
      selectedbrand,
      sortOrder,
      category,
      page = 1,
      limit = 12,
    } = req.query;

    // Chuyển priceRange từ query string thành array
    const priceRanges = priceRange
      ? Array.isArray(priceRange)
        ? priceRange
        : priceRange.split(",")
      : [];

    const products = await filterAll(
      priceRanges,
      keyword,
      selectedbrand,
      category,
      sortOrder,
      parseInt(page),
      parseInt(limit)
    );

    res.json(products);
  } catch (error) {
    console.error("Filter By Brand error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
