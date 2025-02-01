const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
const VideoService = require("../services/videoService");

const processAudio = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { q } = req.query; // used q for QuestionNumber

    const uploadedFolder = path.join(__dirname, "../uploads", sessionId);
    const convertedFolder = path.join(__dirname, "../converted", sessionId);

    // Ensure session upload folder exists
    if (!fs.existsSync(uploadedFolder)) {
      console.log("Session not found");
      return res.status(404).json({ error: "Session not found." });
    }

    // Ensure converted folder exists
    if (!fs.existsSync(convertedFolder)) {
      fs.mkdirSync(convertedFolder, { recursive: true });
    }

    const inputFilePath = path.join(uploadedFolder, req.file.originalname);
    const outputFilePath = path.join(convertedFolder, `${q}.mp3`);

    // Move the uploaded file to the session folder
    fs.renameSync(req.file.path, inputFilePath);
    // 4️⃣ Extract Audio
    await VideoService.extractAudio(inputFilePath, outputFilePath);

    res.json({
      message: " Audio processing completed!",

      files: {
       Audiofile:outputFilePath
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export the function
module.exports = {
  processAudio,
};
