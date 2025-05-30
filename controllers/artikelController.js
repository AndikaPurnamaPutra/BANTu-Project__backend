const Artikel = require('../models/Artikel');

exports.create = async (req, res) => {
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

    const coverImage = req.file ? req.file.secure_url : undefined;

    const artikel = new Artikel({
      title,
      content,
      category,
      tags: parsedTags,
      authorID,
      coverImage,
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

    const updateData = { title, content, category, tags: parsedTags };

    if (req.file) {
      updateData.coverImage = req.file.secure_url;
    }

    const artikel = await Artikel.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!artikel) return res.status(404).json({ message: 'Artikel not found' });
    res.json(artikel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const artikel = await Artikel.findByIdAndDelete(req.params.id);
    if (!artikel) return res.status(404).json({ message: 'Artikel not found' });
    res.json({ message: 'Artikel deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
