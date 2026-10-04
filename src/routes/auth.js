const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
    }

    const [exists] = await pool.query(
      "SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1",
      [username, email]
    );
    if (exists.length) {
      return res.status(409).json({ message: "Tên đăng nhập hoặc email đã tồn tại." });
    }

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users(full_name, username, email, password_hash, role, status)
       VALUES (?, ?, ?, ?, 'learner', 'active')`,
      [fullName, username, email, hash]
    );

    res.json({ message: "Đăng ký thành công." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { account, password } = req.body;
    if (!account || !password) {
      return res.status(400).json({ message: "Vui lòng nhập tài khoản và mật khẩu." });
    }

    const [rows] = await pool.query(
      `SELECT id, full_name, username, email, password_hash, role, status
       FROM users
       WHERE username = ? OR email = ?
       LIMIT 1`,
      [account, account]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Tài khoản không tồn tại." });
    }

    const user = rows[0];
    if (user.status !== "active") {
      return res.status(403).json({ message: "Tài khoản đang bị khóa." });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: "Mật khẩu không chính xác." });
    }

    const token = jwt.sign(
      { id: user.id, name: user.full_name, role: user.role },
      process.env.JWT_SECRET || "english_learning_secret_2026",
      { expiresIn: "8h" }
    );

    res.json({
      message: "Đăng nhập thành công.",
      token,
      user: { id: user.id, name: user.full_name, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
});

module.exports = router;
