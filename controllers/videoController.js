const VideoService = require("../services/videoService");
const path = require("path");
const fs = require("fs");
const VideoModel = require("../models/videoModel");
const { createTables } = require("../config/db");

const processVideo = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { q } = req.query; // used q for QuestionNumber

    if (!sessionId || !q) {
      return res
        .status(400)
        .json({ error: "sessionId and questionNo are required" });
    }

    const uploadedFolder = path.join(__dirname, "../uploads", sessionId);
    const convertedFolder = path.join(__dirname, "../converted", sessionId);

    // Ensure session upload folder exists
    if (!fs.existsSync(uploadedFolder)) {
      return res.status(404).json({ error: "Session not found." });
    }

    // Ensure converted folder exists
    if (!fs.existsSync(convertedFolder)) {
      fs.mkdirSync(convertedFolder, { recursive: true });
    }

    const inputFilePath = path.join(uploadedFolder, req.file.originalname);
    const outputTagFilePath = path.join(convertedFolder, `tag_${q}.mp4`);
    const outputFilePath = path.join(convertedFolder, `${q}.mp4`);

    // Move the uploaded file to the session folder
    fs.renameSync(req.file.path, inputFilePath);

    const text = "Question" + q;
    const taggedText = `drawtext=text=${text}:fontcolor=white:fontsize=24:x=10:y=10`;

    //  Add Text Overlay
    await VideoService.addTextOverlay(
      inputFilePath,
      outputTagFilePath,
      taggedText
    );

    //  Convert to MP4
    await VideoService.convertToMP4(outputTagFilePath, outputFilePath);

    //  Get Video Length
    const length = await VideoService.getVideoLength(outputFilePath);
    console.log(`Video Length: ${length} seconds`);

    // creating file in which we will store list of  all final converted files
    const file_listPath = path.join(
      __dirname,
      "../converted",
      sessionId,
      "file_list.txt"
    );

    // Ensure file_list.txt exists
    if (!fs.existsSync(file_listPath)) {
      fs.writeFileSync(file_listPath, "");
    }

    // Ensure the file path format is correct
    const formattedPath = `file '${q}.mp4'\n`;

    // Append to input.txt
    await fs.promises.appendFile(file_listPath, formattedPath);
    console.log("Video path added successfully in file_list.txt");

    const filename = `${q}.mp4`;

    // Ensure tables exist before storing data
    await new Promise((resolve, reject) => {
      createTables((err) => {
        if (err) {
          console.error("Error creating tables:", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Store video length in database
    await new Promise((resolve, reject) => {
      VideoModel.saveVideoLength(sessionId, filename, length, (err) => {
        if (err) {
          console.error("Database insert error:", err);
          reject(err);
        } else {
          console.log("Video length stored in database");
          resolve();
        }
      });
    });

    // Insert processing details of this video
    const processed = true;
    await new Promise((resolve, reject) => {
      VideoModel.insertProcessingDetail(sessionId, processed, filename , (err, result) => {
        if (err) {
          console.error("Error inserting processing detail:", err);
          reject(err);
        } else {
          console.log("Processing detail added");
          resolve();
        }
      });
    });

    // Send final response
    res.send({
      message: "text overlay, encoding, length calc & stored",
      filename,
      length: length,
      sessionId,
    });
  } catch (error) {
    console.error("Error processing video:", error);

    // Store processing details in database (error case)
    try {
      const processed = false;
      await new Promise((resolve, reject) => {
        VideoModel.insertProcessingDetail(sessionId, processed, (err, result) => {
          if (err) {
            console.error("Error inserting processing detail:", err);
            reject(err);
          } else {
            console.log("Processing detail added (error case)");
            resolve();
          }
        });
      });
    } catch (dbError) {
      console.error("Database error in catch block:", dbError);
    }

    // Send error response
    res.status(500).json({ error: error.message });
  }
};

// Export the function
module.exports = {
  processVideo,
};