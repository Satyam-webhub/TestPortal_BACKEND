const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

exports.createSession = (req, res) => {
  const sessionId = uuidv4();
  const sessionFolder = path.join(__dirname, "../uploads", sessionId);

  // Create a folder for the session
  if (!fs.existsSync(sessionFolder)) {
    fs.mkdirSync(sessionFolder, { recursive: true });
  }

  res.status(201).json({ sessionId });
};
