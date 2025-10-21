const multer = require("multer");

// Dùng memoryStorage để upload trực tiếp lên Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

module.exports = upload;
