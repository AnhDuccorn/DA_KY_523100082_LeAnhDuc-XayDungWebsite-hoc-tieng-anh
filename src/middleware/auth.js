const jwt = require("jsonwebtoken");

function auth(requiredRole = null) {
  return (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) return res.status(401).json({ message: "Chưa đăng nhập." });

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || "english_learning_secret_2026");
      req.user = payload;

      if (requiredRole && payload.role !== requiredRole) {
        return res.status(403).json({ message: "Bạn không có quyền truy cập." });
      }

      next();
    } catch {
      return res.status(401).json({ message: "Phiên đăng nhập không hợp lệ." });
    }
  };
}

module.exports = auth;
