const VideoModel = require("../models/videoModel");

exports.getVideoProcessingDetailBySession = (req, res) => {
  const { sessionId } = req.params; // Extract session ID from URL

  if (!sessionId) {
    return res.status(400).send({ error: "Session ID is required" });
  }

  VideoModel.getProcessingDetailBySession(sessionId, (err, rows) => {
    if (err) {
      console.error("Error retrieving processing detail:", err);
      return res.status(500).send({ error: "Database error" });
    }

    if (!rows) {
      return res
        .status(404)
        .send({ message: "No processing details found for this session" });
    }

    res.send({ sessionId, ProcessingDetails: rows });
  });
};
