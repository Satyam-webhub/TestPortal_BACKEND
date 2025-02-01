const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");

// Create a new session
router.post("/", sessionController.createSession);

module.exports = router;
