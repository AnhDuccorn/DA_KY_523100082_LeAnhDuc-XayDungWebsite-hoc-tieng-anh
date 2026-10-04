const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", auth(), async (req, res) => {
  const [rows] = await pool.query(`
    SELECT l.id, l.title, l.description, l.level, l.duration_minutes,
           t.name AS topic_name,
           COALESCE(p.completion_percent, 0) AS progress
    FROM lessons l
    JOIN topics t ON t.id = l.topic_id
    LEFT JOIN progress p ON p.lesson_id = l.id AND p.user_id = ?
    WHERE l.status = 'active'
    ORDER BY t.id, l.id
  `, [req.user.id]);
  res.json(rows);
});

router.get("/:id", auth(), async (req, res) => {
  const lessonId = Number(req.params.id);
  const [[lesson]] = await pool.query(
    `SELECT l.*, t.name AS topic_name
     FROM lessons l JOIN topics t ON t.id = l.topic_id
     WHERE l.id = ?`,
    [lessonId]
  );
  if (!lesson) return res.status(404).json({ message: "Không tìm thấy bài học." });

  const [contents] = await pool.query(
    `SELECT id, content_type, term, meaning, pronunciation, part_of_speech,
            grammar_structure, usage_note, example_en, example_vi
     FROM lesson_contents
     WHERE lesson_id = ?
     ORDER BY id`,
    [lessonId]
  );

  res.json({ lesson, contents });
});

module.exports = router;
