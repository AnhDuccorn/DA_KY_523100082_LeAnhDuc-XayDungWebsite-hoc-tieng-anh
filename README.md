# WEBSITE HỌC TIẾNG ANH

## Công nghệ
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js + Express.js
- Database: MySQL
- Authentication: JWT + bcrypt

## Quy trình chạy
1. Cài Node.js, XAMPP/MySQL, Visual Studio Code.
2. Bật MySQL.
3. Import `database/english_learning.sql`.
4. Copy `.env.example` thành `.env`.
5. Mở Terminal:
   npm install
6. Tạo admin:
   node database/create-admin.js
7. Chạy website:
   npm start
8. Mở:
   http://localhost:3000

## Tài khoản demo admin
- Username: admin
- Password: admin123

## Quy trình phát triển đề tài
1. Phân tích yêu cầu: người học + quản trị viên.
2. Thiết kế CSDL.
3. Làm đăng ký/đăng nhập.
4. Làm Dashboard.
5. Làm danh sách bài học.
6. Làm từ vựng/ngữ pháp.
7. Làm bài kiểm tra và chấm điểm.
8. Lưu kết quả + tiến độ.
9. Làm trang quản trị.
10. Kiểm thử theo các Test Case của Chương 3.
