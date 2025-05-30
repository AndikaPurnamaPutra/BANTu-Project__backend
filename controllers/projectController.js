const Project = require('../models/Project');
const User = require('../models/User');

exports.create = async (req, res) => {
  try {
    const {
      judulProyek,
      deskripsi,
      estimasiPengerjaan,
      estimasiAnggaranMin,
      estimasiAnggaranMax,
      artisanID,
    } = req.body;

    // Validasi artisan
    const artisan = await User.findById(artisanID);
    if (!artisan)
      return res.status(400).json({ message: 'Artisan (user) not found' });
    if (artisan.role !== 'artisan')
      return res.status(400).json({ message: 'User is not an artisan' });

    const project = new Project({
      judulProyek,
      deskripsi,
      estimasiPengerjaan,
      estimasiAnggaranMin,
      estimasiAnggaranMax,
      artisanID,
    });

    await project.save();

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('artisanID', '-password')
      .lean();

    res.json(projects);
  } catch (error) {
    console.error('Error in project getAll:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('artisanID', '-password')
      .lean();

    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.json(project);
  } catch (error) {
    console.error('Error in project getById:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    if (req.body.artisanID) {
      const artisan = await User.findById(req.body.artisanID);
      if (!artisan)
        return res.status(400).json({ message: 'Artisan (user) not found' });
      if (artisan.role !== 'artisan')
        return res.status(400).json({ message: 'User is not an artisan' });
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.json(project);
  } catch (error) {
    console.error('Error in project update:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Error in project delete:', error);
    res.status(500).json({ message: error.message });
  }
};
