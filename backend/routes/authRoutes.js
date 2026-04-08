const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = "mera_super_secret_key_123"; 

// 1. SIGNUP API 
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check karo ki email pehle se toh nahi hai
    let userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists!" });

    // Password ko encrypt (hide) karo
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Naya user save karo
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user' // Agar role nahi diya, toh normal user banega
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. LOGIN API 
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Email check karo
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found!" });

    // Password check karo
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

    // Sahi hai toh Token (Chabi) banao jisme user ki ID aur Role chhupa hoga
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    // Token aur User ki details bhej do
    res.status(200).json({
      message: "Login successful!",
      token: token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. BOOKMARK API: Mandir save ya unsave karne ke liye
router.post('/toggle-bookmark', async (req, res) => {
  try {
    const { userId, templeId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    // Check karo ki kya ye mandir pehle se saved hai?
    const isSaved = user.savedTemples.includes(templeId);

    if (isSaved) {
      // Agar pehle se hai, toh usko list se hata do (Unsave)
      user.savedTemples = user.savedTemples.filter(id => id.toString() !== templeId);
    } else {
      // Agar nahi hai, toh list mein jod do (Save)
      user.savedTemples.push(templeId);
    }

    await user.save();
    
    // Nayi updated list frontend ko bhej do
    res.status(200).json({ 
      message: isSaved ? "Removed from Saved Temples" : "Added to Saved Temples", 
      savedTemples: user.savedTemples 
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. GET SAVED TEMPLES: User ke saved mandiron ki list laane ke liye
router.get('/saved-temples/:userId', async (req, res) => {
  try {
    // .populate() ka jadoo: Ye sirf ID nahi, balki poore mandir ka data nikal kar layega!
    const user = await User.findById(req.params.userId).populate('savedTemples');
    if (!user) return res.status(404).json({ message: "User not found!" });

    res.status(200).json(user.savedTemples);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;