const { streamUpload } = require("../middlewares/cloudinary");
const { createReportIssue } = require("../services/reportService");

exports.reportIssue = async (req, res) => {
  try {
    const { orderId, productName, issueType, description } = req.body;
    let imageUrl = null;

    // Nếu có file upload (multer)
    if (req.file) {
      imageUrl = await streamUpload(req.file.buffer, "image");
    } else if (req.body.avatar) {
      imageUrl = req.body.avatar;
    }
    const report = await createReportIssue({
      userId: req.user.userId,
      orderId,
      productName,
      issueType,
      description,
      imageUrl,
    });

    return res.status(201).json(report);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
