const express = require("express");
const reportController = require("../controllers/reportController");
const upload = require("../middlewares/upload");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  reportController.reportIssue
);

module.exports = router;
