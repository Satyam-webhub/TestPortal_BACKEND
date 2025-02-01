const express = require("express");
const router = express.Router();
const getVideoData = require("../controllers/getDataController");

const getVideoProcessingData  = require("../controllers/getVideoProcessingDetail");

router.get(
  "/:sessionId/getVideoStartTimes",
  getVideoData.getVideoStartTimes
);
router.get(
  "/:sessionId/getProcessingDetails",
  getVideoProcessingData.getVideoProcessingDetailBySession
);
module.exports = router;



