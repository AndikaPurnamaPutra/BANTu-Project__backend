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

    const coverImage = req.file ? req.file.url : undefined;
    const coverImagePublicId = req.file ? req.file.public_id : undefined;

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
    console.log('req.file:', req.file);
    console.log('req.body.existingCoverImage:', req.body.existingCoverImage);

    const { title, content, category, tags, existingCoverImage } = req.body;

    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch {
        return res.status(400).json({ message: 'Tags must be a JSON array' });
      }
    }

    const updateData = { title, content, category, tags: parsedTags };

    // Ambil artikel lama supaya bisa hapus gambar lama
    const artikelLama = await Artikel.findById(req.params.id);
    if (!artikelLama)
      return res.status(404).json({ message: 'Artikel not found' });

    // Case 1 → upload new image → hapus lama di Cloudinary
    if (req.file) {
      if (artikelLama.coverImagePublicId) {
        try {
          await cloudinary.uploader.destroy(artikelLama.coverImagePublicId);
          console.log('Old image deleted from Cloudinary');
        } catch (err) {
          console.warn('Failed to delete old image:', err.message);
        }
      }

      updateData.coverImage = req.file.url;
      updateData.coverImagePublicId = req.file.public_id;
    }
    // Case 2 → user ingin clear image → hapus lama di Cloudinary
    else if (existingCoverImage === '') {
      if (artikelLama.coverImagePublicId) {
        try {
          await cloudinary.uploader.destroy(artikelLama.coverImagePublicId);
          console.log('Old image deleted from Cloudinary');
        } catch (err) {
          console.warn('Failed to delete old image:', err.message);
        }
      }

      updateData.coverImage = '';
      updateData.coverImagePublicId = '';
    }

    console.log('Final updateData:', updateData);

    const artikel = await Artikel.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json(artikel);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const artikel = await Artikel.findById(req.params.id);
    if (!artikel) return res.status(404).json({ message: 'Artikel not found' });

    // Hapus gambar di Cloudinary kalau ada
    if (artikel.coverImagePublicId) {
      try {
        await cloudinary.uploader.destroy(artikel.coverImagePublicId);
        console.log('Cover image deleted from Cloudinary');
      } catch (err) {
        console.warn('Failed to delete cover image:', err.message);
      }
    }

    await Artikel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Artikel deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
