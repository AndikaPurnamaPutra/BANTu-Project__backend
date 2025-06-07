const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['designer', 'artisan'], required: true },
  profilePic: { type: String },
  bio: { type: String },
  contactInfo: {
    email: { type: String },
    phone: { type: String },
  },
  subCategory: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
