const mongoose = require('mongoose');

const templeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  location: {
    state: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String }
  },
  deity: { type: String, required: true },
  historicalBackground: { type: String, required: true },
  darshanTimings: [{
    sessionName: { type: String }, 
    startTime: { type: String },
    endTime: { type: String }
  }],
  visitorGuidelines: {
    dressCode: { type: String },
    rules: [{ type: String }]
  }
}, { timestamps: true });

module.exports = mongoose.model('Temple', templeSchema);