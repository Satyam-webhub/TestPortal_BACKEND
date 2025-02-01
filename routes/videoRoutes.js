const express = require("express");
const router = express.Router();
const { processVideo } = require("../controllers/videoController");
const multer = require("multer");

// Configure Multer for file uploads
const upload = multer({ dest: "uploads/temp" });

// Upload and convert a video
router.post(
  "/:sessionId/videos",
  upload.single("video"),
  processVideo
);

module.exports = router;
