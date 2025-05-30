const Loker = require('../models/Loker');

exports.create = async (req, res) => {
  try {
    const {
      position,
      company,
      description,
      requirements,
      location,
      salaryMin,
      salaryMax,
    } = req.body;

    const createdBy = req.user._id || req.user;

    let thumbnail = null;
    if (req.file) {
      thumbnail = req.file.path;
    }

    const loker = new Loker({
      position,
      company,
      description,
      requirements,
      location,
      salaryMin,
      salaryMax,
      thumbnail,
      createdBy,
    });

    await loker.save();
    res.status(201).json(loker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const lokers = await Loker.find()
      .populate('createdBy', '-password') // Jangan kirim password user
      .sort({ createdAt: -1 });
    res.json(lokers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const loker = await Loker.findById(req.params.id).populate(
      'createdBy',
      '-password'
    );
    if (!loker) return res.status(404).json({ message: 'Loker not found' });
    res.json(loker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.thumbnail = req.file.path;
    }

    const loker = await Loker.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!loker) return res.status(404).json({ message: 'Loker not found' });
    res.json(loker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const loker = await Loker.findByIdAndDelete(req.params.id);
    if (!loker) return res.status(404).json({ message: 'Loker not found' });
    res.json({ message: 'Loker deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
