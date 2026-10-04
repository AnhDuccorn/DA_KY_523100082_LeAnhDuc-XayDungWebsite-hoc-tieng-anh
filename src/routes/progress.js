const express = require("express");
const pool = require("../db");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", auth(), async (req, res) => {
  const userId = req.user.id;

  const [[summary]] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM lessons WHERE status='active') AS totalLessons,
      (SELECT COUNT(*) FROM progress WHERE user_id=? AND status='completed') AS completedLessons,
      COALESCE((SELECT ROUND(AVG(score),1) FROM results WHERE user_id=?),0) AS averageScore
  `, [userId, userId]);

  const [recent] = await pool.query(`
    SELECT r.score, r.correct_count, r.wrong_count, r.completed_at, l.title
    FROM results r
    JOIN lessons l ON l.id=r.lesson_id
    WHERE r.user_id=?
    ORDER BY r.completed_at DESC
    LIMIT 8
  `, [userId]);

  summary.completionRate = summary.totalLessons
    ? Math.round((summary.completedLessons / summary.totalLessons) * 100)
    : 0;

  res.json({ summary, recent });
});

module.exports = router;
