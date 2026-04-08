# 🚩 Darshan Setu - Temples of India Portal

**Darshan Setu** is a full-stack MERN application designed to explore and manage information about India's sacred temples. This project follows a **Monorepo** structure, housing both the frontend and backend in a single repository.

## 🚀 Live Links
* **Frontend (Live):** [https://darshan-setu.vercel.app](https://darshan-setu.vercel.app)
* **Backend API:** [https://darshan-setu-backend.onrender.com](https://darshan-setu-backend.onrender.com)

---

## ✨ Features
* **User Authentication:** Secure Admin login using **JWT** (JSON Web Tokens).
* **Temple Management:** Full **CRUD** operations (Create, Read, Update, Delete).
* **Cloud Storage:** Integrated with **Cloudinary** for image hosting.
* **Responsive UI:** Crafted with **React** and **Tailwind CSS**.
* **Monorepo Architecture:** Single repository for both Frontend & Backend.

---

## 🛠️ Tech Stack
* **Frontend:** React.js, Vite, Tailwind CSS, Lucide Icons
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (NoSQL)
* **Deployment:** Vercel (Frontend) & Render (Backend)

---

## 📂 Project Structure
```plaintext
darshan-setu-main/
├── backend/           # Node.js & Express API
│   ├── config/        # DB & Cloudinary Config
│   ├── models/        # Mongoose Schemas
│   ├── routes/        # API Endpoints
│   └── server.js      # Entry Point
└── frontend/          # React App (Vite)
    ├── src/           # UI Components & Pages
    ├── public/        # Static Assets
    └── index.html     # Root HTML
