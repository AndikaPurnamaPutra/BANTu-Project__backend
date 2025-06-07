const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    adminUsername: { type: String, required: true },
    adminEmail: { type: String, required: true, unique: true },
    adminPassword: { type: String, required: true },
    adminRole: { type: String, default: 'admin', immutable: true }, // tidak bisa diubah
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
