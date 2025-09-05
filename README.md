# 📌 Sharead - Mini Social Network

## 🚀 Introduction
Sharead is a mini social network (a Threads/Facebook clone) that allows users to:
- Register and log in using JWT + httpOnly cookies  
- Create posts, comments, like/unlike posts  
- Like comments  
- Send/receive friend requests  
- View and edit personal profiles  

The project is built with **Node.js + ExpressJS**, **MongoDB**, and **React**, following the RESTful API model.

---

## 🛠️ Tech Stack
- **Backend**: Node.js, ExpressJS  
- **Database**: MongoDB + Mongoose ODM  
- **Authentication**: JWT, OAuth2, httpOnly cookies, Email service (SMTP)  
- **Validation**: Express Validator / custom middleware  
- **Uploading**: Cloudinary  

---

## 📂 Project Structure
```bash
src/
 ├── controllers/       # Handle requests, call services
 ├── services/          # Business logic layer
 ├── models/            # Mongoose schemas
 ├── routes/            # RESTful route definitions
 ├── middlewares/       # Middleware (auth, validation...)
 ├── utils/             # Helper functions
 ├── app.js             # Express app entry point
 └── server.js          # Server bootstrap
## Demo
![Screenshot 1](https://github.com/user-attachments/assets/c24652bc-acef-40f0-8182-90640da45d43)
![Screenshot 2](https://github.com/user-attachments/assets/2abf8b7b-a7ed-455d-8ae7-bed3257f13aa)
![Screenshot 3](https://github.com/user-attachments/assets/f2b0727e-8c9f-434d-bfb3-8101ab7c112b)
