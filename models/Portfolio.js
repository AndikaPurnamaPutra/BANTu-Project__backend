const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 3 },
  description: { type: String, trim: true },
  category: { type: String, trim: true, lowercase: true },
  media: [String], // URL gambar/video
  clientMessage: { type: String, trim: true },
  creatorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }], 
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
