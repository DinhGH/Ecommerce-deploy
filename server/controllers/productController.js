const { streamUpload } = require("../middlewares/cloudinary");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createManyProducts,
  getProductByTitle,
} = require("../services/productService");

// parse JSON an toàn
const safeParse = (str) => {
  if (!str) return undefined;
  try {
    return JSON.parse(str);
  } catch {
    return undefined;
  }
};

// parse tags an toàn
function parseTags(input) {
  try {
    if (!input) return [];

    // Nếu đã là mảng
    if (Array.isArray(input)) {
      return input.flat().filter(Boolean);
    }

    // Nếu là chuỗi JSON mảng
    if (typeof input === "string") {
      const trimmed = input.trim();
      if (trimmed === "[]") return []; // ✅ xử lý trường hợp gửi []
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed.flat().filter(Boolean) : [parsed];
      }

      // Nếu là chuỗi thường, ví dụ "watch, luxury"
      if (trimmed.includes(",")) {
        return trimmed
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }

      return trimmed ? [trimmed] : [];
    }

    // Nếu kiểu khác
    return [String(input)];
  } catch (err) {
    console.error("⚠️ parseTags error:", err);
    return [];
  }
}

exports.addProduct = async (req, res) => {
  try {
    const processOneProduct = async (body, files) => {
      // Upload thumbnail
      let thumbnailUrl = body.thumbnail || null;
      if (files?.thumbnail?.[0]) {
        thumbnailUrl = await streamUpload(files.thumbnail[0].buffer);
      }

      // Images
      let imageUrls = [];
      let imagesJson = safeParse(body.images);

      if (!imagesJson && Array.isArray(body.images)) {
        imagesJson = body.images;
      }

      if (typeof imagesJson === "string") {
        imagesJson = [imagesJson];
      }

      if (Array.isArray(imagesJson)) {
        imageUrls.push(...imagesJson.filter((url) => typeof url === "string"));
      }

      if (files?.newImages?.length) {
        const uploads = await Promise.all(
          files.newImages.map((f) => streamUpload(f.buffer))
        );
        imageUrls.push(...uploads);
      }

      // Upload barcode
      let barcodeUrl = body.barcode || null;
      if (files?.barcode?.[0]) {
        barcodeUrl = await streamUpload(files.barcode[0].buffer);
      }

      // Upload QR code
      let qrCodeUrl = body.qrCode || null;
      if (files?.qrCode?.[0]) {
        qrCodeUrl = await streamUpload(files.qrCode[0].buffer);
      }

      // Chuẩn bị dữ liệu (map vào schema Product)
      return {
        title: body.title,
        description: body.description,
        category: body.category,
        price: body.price ? parseFloat(body.price) : null,
        discountPercentage: body.discountPercentage
          ? parseFloat(body.discountPercentage)
          : null,
        rating: body.rating ? parseFloat(body.rating) : null,
        stock: body.stock ? parseInt(body.stock) : 0,
        brand: body.brand || null,
        sku: body.sku || null,
        weight: body.weight ? parseInt(body.weight) : null,
        warrantyInformation: body.warrantyInformation || null,
        shippingInformation: body.shippingInformation || null,
        availabilityStatus: body.availabilityStatus || null,
        returnPolicy: body.returnPolicy || null,
        minimumOrderQuantity: body.minimumOrderQuantity
          ? parseInt(body.minimumOrderQuantity)
          : null,

        thumbnail: thumbnailUrl,
        tags: parseTags(body.tags), // 🔥 fix tags ở đây
        images: imageUrls.length ? imageUrls : undefined,

        width: body.width ? parseFloat(body.width) : null,
        height: body.height ? parseFloat(body.height) : null,
        depth: body.depth ? parseFloat(body.depth) : null,

        barcode: barcodeUrl,
        qrCode: qrCodeUrl,
      };
    };

    let result;

    // Nếu body là mảng → tạo nhiều sản phẩm
    if (Array.isArray(req.body)) {
      const productsData = await Promise.all(
        req.body.map((item) => processOneProduct(item, req.files))
      );
      result = await createManyProducts(productsData);
    } else {
      // Nếu body là 1 object → tạo 1 sản phẩm
      const productData = await processOneProduct(req.body, req.files);
      result = await createProduct(productData);
    }

    res.json(result);
  } catch (err) {
    console.error("🔥 Add product error:", err);
    res
      .status(500)
      .json({ error: "Lỗi khi thêm sản phẩm", detail: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product = await getProductById(id);
    if (!product)
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });

    // Thumbnail
    let thumbnailUrl = product.thumbnail;
    if (req.files?.thumbnail?.[0]) {
      thumbnailUrl = await streamUpload(req.files.thumbnail[0].buffer);
    } else if (req.body.thumbnail) {
      thumbnailUrl = Array.isArray(req.body.thumbnail)
        ? req.body.thumbnail[0]
        : req.body.thumbnail;
    }

    // Barcode
    let barcodeUrl = product.barcode;
    if (req.files?.barcode?.[0]) {
      barcodeUrl = await streamUpload(req.files.barcode[0].buffer);
    } else if (req.body.barcode) {
      barcodeUrl = Array.isArray(req.body.barcode)
        ? req.body.barcode[0]
        : req.body.barcode;
    }

    // QR Code
    let qrCodeUrl = product.qrCode;
    if (req.files?.qrCode?.[0]) {
      qrCodeUrl = await streamUpload(req.files.qrCode[0].buffer);
    } else if (req.body.qrCode) {
      qrCodeUrl = Array.isArray(req.body.qrCode)
        ? req.body.qrCode[0]
        : req.body.qrCode;
    }

    // Images
    let imageUrls = product.images || [];
    const existingImages = safeParse(req.body.existingImages) || [];

    if (req.files?.newImages?.length) {
      const uploads = await Promise.all(
        req.files.newImages.map((f) => streamUpload(f.buffer))
      );
      imageUrls = [...existingImages, ...uploads]; // giữ ảnh cũ + thêm mới
    } else {
      imageUrls = existingImages;
    }

    // Dữ liệu update
    const rating = parseFloat(req.body.rating);
    const productData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      price: parseFloat(req.body.price) || 0,
      discountPercentage: req.body.discountPercentage
        ? parseFloat(req.body.discountPercentage)
        : null,
      rating: !isNaN(rating) ? rating : null,

      stock: req.body.stock ? parseInt(req.body.stock) : 0,
      brand: req.body.brand || null,
      sku: req.body.sku || null,
      weight: req.body.weight ? parseInt(req.body.weight) : null,
      warrantyInformation: req.body.warrantyInformation || null,
      shippingInformation: req.body.shippingInformation || null,
      availabilityStatus: req.body.availabilityStatus || null,
      returnPolicy: req.body.returnPolicy || null,
      minimumOrderQuantity: req.body.minimumOrderQuantity
        ? parseInt(req.body.minimumOrderQuantity)
        : null,
      thumbnail: thumbnailUrl,
      tags: parseTags(req.body.tags), // 🔥 fix tags ở đây
      images: imageUrls,
      width: req.body.width ? parseFloat(req.body.width) : null,
      height: req.body.height ? parseFloat(req.body.height) : null,
      depth: req.body.depth ? parseFloat(req.body.depth) : null,
      barcode: barcodeUrl,
      qrCode: qrCodeUrl,
    };

    const updated = await updateProduct(id, productData);
    res.json(updated);
  } catch (err) {
    console.error("🔥 Update product error:", err);
    res
      .status(500)
      .json({ error: "Lỗi khi cập nhật sản phẩm", detail: err.message });
  }
};

exports.getProductsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getProducts(page, limit);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await getProductById(Number(req.params.id));
    if (!product)
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteProduct(id);

    if (!deleted) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    res.json({ message: "✅ Xóa sản phẩm thành công", deleted });
  } catch (err) {
    console.error("🔥 Delete product error:", err);
    res
      .status(500)
      .json({ error: "Lỗi khi xóa sản phẩm", detail: err.message });
  }
};
exports.getProductByTitle = async (req, res) => {
  try {
    const { title } = req.params; // controller lấy từ req
    const product = await getProductByTitle(title);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("❌ getProductByTitle controller error:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};
