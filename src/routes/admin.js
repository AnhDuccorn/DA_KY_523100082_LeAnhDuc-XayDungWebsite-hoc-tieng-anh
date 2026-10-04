const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/summary", auth("admin"), async (req, res) => {
  const [[row]] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM users) AS users,
      (SELECT COUNT(*) FROM lessons) AS lessons,
      (SELECT COUNT(*) FROM questions) AS questions,
      (SELECT COUNT(*) FROM results) AS attempts
  `);
  res.json(row);
});

router.get("/users", auth("admin"), async (req, res) => {
  const [rows] = await pool.query(
    `SELECT id, full_name, username, email, role, status, created_at
     FROM users ORDER BY id DESC`
  );
  res.json(rows);
});

router.post("/lessons", auth("admin"), async (req, res) => {
  const { topicId, title, description, level, durationMinutes } = req.body;
  if (!topicId || !title) {
    return res.status(400).json({ message: "Thiếu chủ đề hoặc tên bài học." });
  }
  const [result] = await pool.query(
    `INSERT INTO lessons(topic_id,title,description,level,duration_minutes,status)
     VALUES(?,?,?,?,?,'active')`,
    [topicId, title, description || "", level || "Cơ bản", Number(durationMinutes || 15)]
  );
  res.json({ message: "Thêm bài học thành công.", id: result.insertId });
});

module.exports = router;
