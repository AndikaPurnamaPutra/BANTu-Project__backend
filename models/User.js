// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   firstName: { type: String, required: true },
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['designer', 'artisan'], required: true },
//   profilePic: { type: String },
//   bio: { type: String },
//   contactInfo: {
//     email: { type: String },
//     phone: { type: String },
//   },
//   subCategory: [{ type: String }],
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);

// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // Bidang Umum untuk Semua Pengguna
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'designer', 'artisan'], // Tambahkan 'admin' di sini
      required: true,
    },

    // Bidang Opsional/Spesifik untuk Peran Non-Admin ('designer', 'artisan')
    firstName: { type: String }, // Tidak wajib untuk admin
    profilePic: { type: String }, // Tidak wajib untuk admin
    bio: { type: String }, // Tidak wajib untuk admin
    contactInfo: {
      // Mungkin hanya relevan untuk designer/artisan
      email: { type: String },
      phone: { type: String },
    },
    subCategory: [{ type: String }], // Hanya relevan untuk 'designer'
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
