const VideoService = require("../services/videoService");
const fs = require("fs");
const path = require("path");
const VideoModel = require("../models/videoModel");
const { createTables } = require("../config/db");

const concatenateVideos = async (req, res) => {
  try {
    const { sessionId } = req.params; // Get sessionId from request parameters
    const folderPath = path.join(__dirname, "../uploads", sessionId); // Folder named after sessionId
    const mergedFolder = path.join(__dirname, "../merged", sessionId);

    // Check if the session folder exists
    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Create mergedFolder if it doesn't exist
    if (!fs.existsSync(mergedFolder)) {
      fs.mkdirSync(mergedFolder, { recursive: true });
    }

    // Input file path
    const inputFile = path.join(
      __dirname,
      "../converted",
      sessionId,
      "file_list.txt"
    );

    // Output file path
    const outputFile = path.join(
      __dirname,
      "../merged",
      sessionId,
      `${sessionId}.mp4`
    );

    console.log("Starting Merging Process");

    // Merge videos
    await VideoService.mergeVideos(inputFile, outputFile);

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

    // Retrieve all video lengths for the session
    const videos = await new Promise((resolve, reject) => {
      VideoModel.getAllVideoLengths(sessionId, (err, videos) => {
        if (err) {
          console.error("Error retrieving videos:", err);
          reject(err);
        } else {
          resolve(videos);
        }
      });
    });

    if (videos.length === 0) {
      return res.status(400).send("No videos available for merging");
    }

    // Calculate start times for each video
    let startTime = 0;
    const startTimes = videos.map((video) => {
      const entry = { filename: video.filename, start_time: startTime };
      startTime += video.length;
      return entry;
    });

    // Clear existing start times for the session
    await new Promise((resolve, reject) => {
      VideoModel.clearStartTimes(sessionId, (err) => {
        if (err) {
          console.error("Error clearing start times:", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Save start times to the database
    await new Promise((resolve, reject) => {
      VideoModel.saveStartTimes(sessionId, startTimes, (err) => {
        if (err) {
          console.error("Error inserting start times:", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Send final response
    res.send({
      message: "Start times table created",
      videos: startTimes,
    });
  } catch (error) {
    console.error("Error in concatenateVideos:", error);

    // Send error response
    res.status(500).json({ error: error.message });
  }
};

// Export the function
module.exports = {
  concatenateVideos,
};