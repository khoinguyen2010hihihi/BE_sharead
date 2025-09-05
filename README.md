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
<img width="1894" height="876" alt="Screenshot 2025-09-05 210045" src="https://github.com/user-attachments/assets/c24652bc-acef-40f0-8182-90640da45d43" />
<img width="1919" height="870" alt="Screenshot 2025-09-05 210344" src="https://github.com/user-attachments/assets/2abf8b7b-a7ed-455d-8ae7-bed3257f13aa" />
<img width="1919" height="877" alt="Screenshot 2025-09-05 210324" src="https://github.com/user-attachments/assets/f2b0727e-8c9f-434d-bfb3-8101ab7c112b" />
<img width="1903" height="869" alt="Screenshot 2025-09-05 210227" src="https://github.com/user-attachments/assets/e6c8698d-e000-4b69-b610-f5eb6a562493" />
<img width="1885" height="874" alt="Screenshot 2025-09-05 210241" src="https://github.com/user-attachments/assets/c444566b-4e90-44ef-9bc4-62a306a23d86" />
<img width="1900" height="868" alt="Screenshot 2025-09-05 210257" src="https://github.com/user-attachments/assets/0d3fbbb9-fd5d-4d84-a19d-a37e8ffa47f2" />
