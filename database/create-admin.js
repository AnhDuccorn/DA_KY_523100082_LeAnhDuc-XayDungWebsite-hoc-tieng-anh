require("dotenv").config();
const bcrypt = require("bcryptjs");
const pool = require("../src/db");

(async () => {
  try {
    const hash = await bcrypt.hash("admin123", 10);
    await pool.query(`
      INSERT INTO users(full_name,username,email,password_hash,role,status)
      VALUES('Quản trị viên','admin','admin@gmail.com',?,'admin','active')
      ON DUPLICATE KEY UPDATE password_hash=VALUES(password_hash), role='admin', status='active'
    `,[hash]);
    console.log("Đã tạo tài khoản admin: admin / admin123");
  } finally {
    await pool.end();
  }
})();
