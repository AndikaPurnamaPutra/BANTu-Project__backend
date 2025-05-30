const mongoose = require('mongoose');

const lokerSchema = new mongoose.Schema({
  position: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String },
  requirements: { type: String },
  location: { type: String },
  thumbnail: { type: String },
  salaryMin: { type: Number },
  salaryMax: { type: Number },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Loker', lokerSchema);
