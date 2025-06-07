const mongoose = require('mongoose');

const artikelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String },
  tags: [{ type: String }],
  authorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverImage: { type: String }, // URL atau path gambar cover
  coverImagePublicId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Artikel', artikelSchema);
