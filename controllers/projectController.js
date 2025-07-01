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
      designerID, // Ambil designerID dari req.body
    } = req.body;

    const artisanID = req.user.userId;

    if (req.user.role !== 'artisan') {
      return res
        .status(403)
        .json({ message: 'Hanya artisan yang dapat membuat proyek.' });
    }

    if (!designerID) {
      return res.status(400).json({ message: 'ID desainer wajib diisi.' });
    }

    const finalEstimasiPengerjaan = Number(estimasiPengerjaan);
    const finalEstimasiAnggaranMin = Number(estimasiAnggaranMin);
    const finalEstimasiAnggaranMax = estimasiAnggaranMax
      ? Number(estimasiAnggaranMax)
      : undefined;

    if (isNaN(finalEstimasiPengerjaan) || finalEstimasiPengerjaan <= 0) {
      return res
        .status(400)
        .json({ message: 'Estimasi pengerjaan harus angka positif.' });
    }
    if (isNaN(finalEstimasiAnggaranMin) || finalEstimasiAnggaranMin < 100000) {
      return res
        .status(400)
        .json({
          message:
            'Estimasi anggaran minimal harus lebih dari atau sama dengan Rp 100.000.',
        });
    }
    if (
      finalEstimasiAnggaranMax !== undefined &&
      (isNaN(finalEstimasiAnggaranMax) ||
        finalEstimasiAnggaranMax < finalEstimasiAnggaranMin)
    ) {
      return res
        .status(400)
        .json({
          message:
            'Estimasi anggaran maksimal harus lebih besar dari anggaran minimal.',
        });
    }

    const project = new Project({
      judulProyek,
      deskripsi,
      estimasiPengerjaan: finalEstimasiPengerjaan,
      estimasiAnggaranMin: finalEstimasiAnggaranMin,
      estimasiAnggaranMax: finalEstimasiAnggaranMax,
      artisanID,
      designerID, // Tetapkan designerID ke objek Project
    });

    await project.save();

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message || 'Gagal membuat proyek.' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('artisanID', 'firstName username profilePic')
      .populate('designerID', 'firstName username profilePic')
      .lean();

    res.json(projects);
  } catch (error) {
    console.error('Error in project getAll:', error);
    res
      .status(500)
      .json({ message: error.message || 'Gagal mengambil proyek.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('artisanID', 'firstName username profilePic')
      .populate('designerID', 'firstName username profilePic')
      .lean();

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error in project getById:', error);
    res
      .status(500)
      .json({ message: error.message || 'Gagal mengambil detail proyek.' });
  }
};

exports.update = async (req, res) => {
  try {
    const projectId = req.params.id;
    const currentUserId = req.user.userId;
    const currentUserRole = req.user.role;

    const projectToUpdate = await Project.findById(projectId);
    if (!projectToUpdate) {
      return res.status(404).json({ message: 'Proyek tidak ditemukan.' });
    }

    if (
      projectToUpdate.artisanID.toString() !== currentUserId.toString() &&
      currentUserRole !== 'admin'
    ) {
      return res
        .status(403)
        .json({
          message: 'Anda tidak memiliki izin untuk mengupdate proyek ini.',
        });
    }

    const {
      judulProyek,
      deskripsi,
      estimasiPengerjaan,
      estimasiAnggaranMin,
      estimasiAnggaranMax,
    } = req.body;

    const finalEstimasiPengerjaan = Number(estimasiPengerjaan);
    const finalEstimasiAnggaranMin = Number(estimasiAnggaranMin);
    const finalEstimasiAnggaranMax = estimasiAnggaranMax
      ? Number(estimasiAnggaranMax)
      : undefined;

    if (isNaN(finalEstimasiPengerjaan) || finalEstimasiPengerjaan <= 0) {
      return res
        .status(400)
        .json({ message: 'Estimasi pengerjaan harus angka positif.' });
    }
    if (isNaN(finalEstimasiAnggaranMin) || finalEstimasiAnggaranMin < 100000) {
      return res
        .status(400)
        .json({
          message:
            'Estimasi anggaran minimal harus lebih dari atau sama dengan Rp 100.000.',
        });
    }
    if (
      finalEstimasiAnggaranMax !== undefined &&
      (isNaN(finalEstimasiAnggaranMax) ||
        finalEstimasiAnggaranMax < finalEstimasiAnggaranMin)
    ) {
      return res
        .status(400)
        .json({
          message:
            'Estimasi anggaran maksimal harus lebih besar dari anggaran minimal.',
        });
    }

    const updateData = {
      judulProyek,
      deskripsi,
      estimasiPengerjaan: finalEstimasiPengerjaan,
      estimasiAnggaranMin: finalEstimasiAnggaranMin,
      estimasiAnggaranMax: finalEstimasiAnggaranMax,
    };

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(updatedProject);
  } catch (error) {
    console.error('Error in project update:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res
      .status(500)
      .json({ message: error.message || 'Gagal mengupdate proyek.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const projectId = req.params.id;
    const currentUserId = req.user.userId;
    const currentUserRole = req.user.role;

    const projectToDelete = await Project.findById(projectId);
    if (!projectToDelete) {
      return res.status(404).json({ message: 'Proyek tidak ditemukan.' });
    }

    if (
      projectToDelete.artisanID.toString() !== currentUserId.toString() &&
      currentUserRole !== 'admin'
    ) {
      return res
        .status(403)
        .json({
          message: 'Anda tidak memiliki izin untuk menghapus proyek ini.',
        });
    }

    await Project.findByIdAndDelete(projectId);
    res.json({ message: 'Proyek berhasil dihapus.' });
  } catch (error) {
    console.error('Error in project delete:', error);
    res
      .status(500)
      .json({ message: error.message || 'Gagal menghapus proyek.' });
  }
};
