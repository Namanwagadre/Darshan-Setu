
🚩 Darshan Setu - Temples of India Portal
Darshan Setu is a full-stack MERN application designed to explore and manage information about India's sacred temples. This project follows a Monorepo structure, housing both the frontend and backend in a single repository for better management and deployment.

🚀 Live Links
Frontend (Live): https://darshan-setu.vercel.app

Backend API: https://darshan-setu-backend.onrender.com

✨ Features
User Authentication: Secure Admin login using JWT (JSON Web Tokens).

Temple Management: Full CRUD operations (Create, Read, Update, Delete) for temple records.

Cloud Storage: Integrated with Cloudinary for high-quality image hosting.

Responsive UI: Crafted with React and Tailwind CSS for a seamless experience on all devices.

Monorepo Architecture: Organized structure for easy scaling and maintenance.

🛠️ Tech Stack
Frontend: React.js, Vite, Tailwind CSS, Lucide Icons.

Backend: Node.js, Express.js.

Database: MongoDB Atlas (NoSQL).

Deployment: Vercel (Frontend) & Render (Backend).

📂 Project Structure
Plaintext
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
🔧 Installation & Setup
Clone the Repo:

Bash
git clone https://github.com/Namanwagadre/Darshan-Setu-Fullstack.git
cd Darshan-Setu-Fullstack
Backend Setup:

Bash
cd backend
npm install
# Create a .env file and add: MONGO_URI, JWT_SECRET, CLOUDINARY_CLOUD_NAME, etc.
npm start
Frontend Setup:

Bash
cd ../frontend
npm install
npm run dev
👨‍💻 Developed By
Naman Wagadre M.C.A. Student @ SCSIT-DAVV, Indore GitHub | LinkedIn

📝 Note
This project was developed as part of the Unified Mentor Virtual Internship.
