const express = require("express");
const router = express.Router();
const {processAudio} = require("../controllers/audioController");
const multer = require("multer");

// Configure Multer for file uploads
const upload = multer({ dest: "uploads/temp" });

router.post(
  "/:sessionId/audios",
  upload.single("video"),
  processAudio
);

module.exports = router;
