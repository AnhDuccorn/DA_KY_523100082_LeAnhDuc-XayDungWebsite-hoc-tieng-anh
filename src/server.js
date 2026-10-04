const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const lessonRoutes = require("./routes/lessons");
const quizRoutes = require("./routes/quiz");
const progressRoutes = require("./routes/progress");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/admin", adminRoutes);

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Website đang chạy tại http://localhost:${port}`);
});
