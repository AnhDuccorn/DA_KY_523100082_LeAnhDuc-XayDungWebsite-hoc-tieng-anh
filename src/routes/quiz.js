const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/:lessonId", auth(), async (req, res) => {
  const lessonId = Number(req.params.lessonId);
  const [rows] = await pool.query(
    `SELECT id, question_text, option_a, option_b, option_c, option_d
     FROM questions
     WHERE lesson_id = ?`,
    [lessonId]
  );
  res.json(rows);
});

router.post("/:lessonId/submit", auth(), async (req, res) => {
  const lessonId = Number(req.params.lessonId);
  const answers = req.body.answers || {};

  const [questions] = await pool.query(
    `SELECT id, correct_option FROM questions WHERE lesson_id = ?`,
    [lessonId]
  );

  if (!questions.length) {
    return res.status(400).json({ message: "Bài học chưa có câu hỏi." });
  }

  let correct = 0;
  for (const q of questions) {
    if ((answers[q.id] || "").toUpperCase() === q.correct_option) correct++;
  }

  const total = questions.length;
  const wrong = total - correct;
  const score = Number(((correct / total) * 10).toFixed(1));

  await pool.query(
    `INSERT INTO results(user_id, lesson_id, score, correct_count, wrong_count, completed_at)
     VALUES (?, ?, ?, ?, ?, NOW())`,
    [req.user.id, lessonId, score, correct, wrong]
  );

  await pool.query(
    `INSERT INTO progress(user_id, lesson_id, completion_percent, status, updated_at)
     VALUES (?, ?, 100, 'completed', NOW())
     ON DUPLICATE KEY UPDATE completion_percent=100, status='completed', updated_at=NOW()`,
    [req.user.id, lessonId]
  );

  res.json({ total, correct, wrong, score });
});

module.exports = router;
