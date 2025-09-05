# 📌 Sharead - Mini Social Network

## 🚀 Giới thiệu
Sharead là một mạng xã hội mini (clone Threads/Facebook) cho phép người dùng:
- Đăng ký, đăng nhập bằng JWT + cookie httpOnly  
- Tạo bài viết, bình luận, like/unlike  
- Like bình luận  
- Gửi/nhận lời mời kết bạn  
- Trang cá nhân, chỉnh sửa thông tin

Dự án được phát triển với **Node.js + ExpressJS**, **MongoDB** và **React** , theo mô hình RESTful API.

---

## 🛠️ Công nghệ sử dụng
- **Backend**: Node.js, ExpressJS  
- **Database**: MongoDB + Mongoose ODM  
- **Authentication**: JWT, OAuth2, cookie httpOnly, Email service (SMTP)
- **Validation**: Express Validator / custom middleware
- **Uploading**: Cloudinary   

---

## 📂 Cấu trúc thư mục
```bash
src/
 ├── controllers/       # Xử lý request, gọi service
 ├── services/          # Business logic
 ├── models/            # Mongoose schema
 ├── routes/            # Định nghĩa route RESTful
 ├── middlewares/       # Middleware (auth, validate...)
 ├── utils/             # Helper functions
 ├── app.js             # Express app entry
 └── server.js          # Chạy server

## DEMO
<img width="1894" height="876" alt="image" src="https://github.com/user-attachments/assets/f08ea87f-cb8a-4cf9-8485-55cdfa5e3f1c" />
<img width="1919" height="877" alt="image" src="https://github.com/user-attachments/assets/a0545e20-db35-4abb-bbe7-f59465ea96b6" />
<img width="1919" height="870" alt="image" src="https://github.com/user-attachments/assets/ef27b645-eda7-4513-bfa1-06288b3db6e4" />
<img width="1903" height="869" alt="image" src="https://github.com/user-attachments/assets/b33cd53b-1fbb-4b11-b434-74f4664dbc17" />
<img width="1900" height="868" alt="image" src="https://github.com/user-attachments/assets/2ba3a5a2-dcff-4b46-bebf-32fa6e2640fb" />
<img width="1885" height="874" alt="image" src="https://github.com/user-attachments/assets/7e04c45b-f89b-4ad1-837e-182da9904b16" />

