const express = require("express");
const app = express();
const sessionRoutes = require("./routes/sessionRoutes");
const videoRoutes = require("./routes/videoRoutes");
const mergeRoutes = require("./routes/mergeRoutes");
const audioRoutes = require("./routes/audioRoutes");
const getVideoRoutes = require("./routes/getVideoRoutes");
const PORT = 3000;

app.use(express.json());

// Routes
app.use("/sessions", sessionRoutes);
app.use("/sessions", videoRoutes);
app.use("/sessions", mergeRoutes);
app.use("/sessions", audioRoutes);
 app.use("/sessions", getVideoRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
