const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  judulProyek: { type: String, required: true },
  deskripsi: { type: String, required: true },
  estimasiPengerjaan: { type: Number, required: true },
  estimasiAnggaranMin: { type: Number, required: true },
  estimasiAnggaranMax: { type: Number, required: true },
  artisanID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }, // client pemesan
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', projectSchema);
