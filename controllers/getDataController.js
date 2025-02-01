const VideoModel = require("../models/videoModel");

// Get all video start times for a session
exports.getVideoStartTimes = (req, res) => {
  const { sessionId } = req.params; // Extract session ID from URL

  if (!sessionId) {
    return res.status(400).send({ error: "Session ID is required" });
  }

  VideoModel.getAllStartTimes(sessionId, (err, rows) => {
    if (err) {
      console.error("Error retrieving video start times:", err);
      return res.status(500).send({ error: "Database error" });
    }

    if (rows.length === 0) {
      return res
        .status(404)
        .send({ message: "No video start times found for this session" });
    }

    res.send({ sessionId, start_times: rows });
  });
};
