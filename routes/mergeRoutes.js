const express = require("express");
const router = express.Router();
const {concatenateVideos} = require("../controllers/mergeController");

// Create a new session
router.post("/:sessionId/end", concatenateVideos);

module.exports = router;
