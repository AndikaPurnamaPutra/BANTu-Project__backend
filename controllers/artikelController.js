const Artikel = require('../models/Artikel');
const cloudinary = require('../config/cloudinaryConfig');

exports.create = async (req, res) => {
  console.log('File uploaded:', req.file);
  try {
    const { title, content, category, tags } = req.body;
    const authorID = req.user;

    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch {
        return res.status(400).json({ message: 'Tags must be a JSON array' });
      }
    }

    const coverImage = req.file ? req.file.path : undefined;
    const coverImagePublicId = req.file ? req.file.filename : undefined;

    const artikel = new Artikel({
      title,
      content,
      category,
      tags: parsedTags,
      authorID,
      coverImage,
      coverImagePublicId,
    });

    await artikel.save();
    res.status(201).json(artikel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const artikels = await Artikel.find()
      .populate('authorID', '-password')
      .sort({ createdAt: -1 });
    res.json(artikels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const artikel = await Artikel.findById(req.params.id).populate(
      'authorID',
      '-password'
    );
    if (!artikel) return res.status(404).json({ message: 'Artikel not found' });
    res.json(artikel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch {
        return res.status(400).json({ message: 'Tags must be a JSON array' });
      }
    }

    const artikel = await Artikel.findById(req.params.id);
    if (!artikel) return res.status(404).json({ message: 'Artikel not found' });

    // Kalau ada file baru, hapus cover image lama
    if (req.file && artikel.coverImagePublicId) {
      await cloudinary.uploader.destroy(artikel.coverImagePublicId);
    }

    // Update field
    artikel.title = title ?? artikel.title;
    artikel.content = content ?? artikel.content;
    artikel.category = category ?? artikel.category;
    artikel.tags = parsedTags.length > 0 ? parsedTags : artikel.tags;

    if (req.file) {
      artikel.coverImage = req.file.path;
      artikel.coverImagePublicId = req.file.filename;
    }

    await artikel.save();
    res.json(artikel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const artikel = await Artikel.findByIdAndDelete(req.params.id);
    if (!artikel) return res.status(404).json({ message: 'Artikel not found' });

    // Hapus cover image lama jika ada
    if (artikel.coverImagePublicId) {
      await cloudinary.uploader.destroy(artikel.coverImagePublicId);
    }

    res.json({ message: 'Artikel deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
