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
```
