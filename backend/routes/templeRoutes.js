const express = require('express');
const router = express.Router();
const Temple = require('../models/Temple');
const upload = require('../config/cloudinary');

// 1. GET: Saare temples fetch karne ke liye
router.get('/', async (req, res) => {
  try {
    const temples = await Temple.find();
    res.status(200).json(temples);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🌟 NAYA ROUTE (Smart Error Handler ke sath)
router.post('/upload-image', (req, res) => {
  upload.single('image')(req, res, function (err) {
   
    if (err) {
      console.error("❌ CLOUDINARY ERROR:", err);
      return res.status(500).json({ message: err.message || "Cloudinary upload failed" });
    }
    
    
    if (!req.file) {
      console.error("❌ ERROR: File backend tak nahi aayi!");
      return res.status(400).json({ message: "No file uploaded!" });
    }
    
    
    console.log("✅ Photo Cloudinary par upload ho gayi! URL:", req.file.path);
    res.status(200).json({ imageUrl: req.file.path });
  });
});

// 2. POST:
router.post('/', async (req, res) => {
  const newTemple = new Temple(req.body);
  try {
    const savedTemple = await newTemple.save();
    res.status(201).json(savedTemple);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. GET: 
router.get('/:id', async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id);
    if (!temple) return res.status(404).json({ message: 'Temple not found' });
    res.status(200).json(temple);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. DELETE: 
router.delete('/:id', async (req, res) => {
  try {
    const deletedTemple = await Temple.findByIdAndDelete(req.params.id);
    if (!deletedTemple) return res.status(404).json({ message: 'Temple not found' });
    res.status(200).json({ message: 'Temple deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. UPDATE: 
router.put('/:id', async (req, res) => {
  try {
   
    const updatedTemple = await Temple.findByIdAndUpdate(req.params.id, req.body, {returnDocument: 'after'});
    if (!updatedTemple) return res.status(404).json({ message: 'Temple not found' });
    res.status(200).json(updatedTemple);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;