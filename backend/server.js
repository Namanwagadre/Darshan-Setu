// 🌟 RULE 1: DOTENV SABSE UPAR HONA CHAHIYE
require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Ye line check karne ke liye hai ki details mil rahi hain ya nahi
console.log("Cloudinary Name Check:", process.env.CLOUDINARY_CLOUD_NAME);

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // JSON data parse karne ke liye

// Routes (Cleaned up - ab koi duplicate nahi hai)
app.use('/api/temples', require('./routes/templeRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' MongoDB Connected Successfully');
    // Start Server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error(' MongoDB Connection Error:', err.message);
  });