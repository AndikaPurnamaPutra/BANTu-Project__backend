const ProjectDesigner = require('../models/ProjectDesigner');
const User = require('../models/User');
const Project = require('../models/Project');

exports.assignDesigner = async (req, res) => {
  try {
    const { projectID, designerID } = req.body;

    const project = await Project.findById(projectID);
    if (!project) {
      return res.status(404).json({ message: 'Proyek tidak ditemukan.' });
    }

    const designer = await User.findById(designerID);
    if (!designer) {
      return res.status(404).json({ message: 'Desainer tidak ditemukan.' });
    }
    if (designer.role !== 'designer') {
      return res.status(400).json({ message: 'Pengguna bukan desainer.' });
    }

    const exists = await ProjectDesigner.findOne({ projectID, designerID });
    if (exists) {
      return res
        .status(400)
        .json({ message: 'Desainer sudah ditugaskan ke proyek ini.' });
    }

    const assignment = new ProjectDesigner({ projectID, designerID });
    await assignment.save();

    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error assigning designer:', error);
    res
      .status(500)
      .json({ message: error.message || 'Gagal menetapkan desainer.' });
  }
};

exports.getDesignersByProject = async (req, res) => {
  try {
    const projectID = req.params.projectID;
    const assignments = await ProjectDesigner.find({ projectID })
      .populate('designerID', 'firstName username profilePic')
      .lean();

    res.json(assignments);
  } catch (error) {
    console.error('Error in getDesignersByProject:', error);
    res
      .status(500)
      .json({
        message:
          error.message || 'Gagal mengambil desainer berdasarkan proyek.',
      });
  }
};

exports.getProjectsByDesigner = async (req, res) => {
  try {
    const designerID = req.params.designerID;
    const assignments = await ProjectDesigner.find({ designerID })
      .populate('projectID')
      .lean();

    res.json(assignments);
  } catch (error) {
    console.error('Error in getProjectsByDesigner:', error);
    res
      .status(500)
      .json({
        message:
          error.message || 'Gagal mengambil proyek berdasarkan desainer.',
      });
  }
};

exports.removeAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.userId;
    const currentUserRole = req.user.role;

    const assignment = await ProjectDesigner.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: 'Penugasan tidak ditemukan.' });
    }

    if (currentUserRole !== 'admin') {
      return res
        .status(403)
        .json({
          message: 'Anda tidak memiliki izin untuk menghapus penugasan ini.',
        });
    }

    await ProjectDesigner.findByIdAndDelete(id);
    res.json({ message: 'Penugasan berhasil dihapus.' });
  } catch (error) {
    console.error('Error in removeAssignment:', error);
    res
      .status(500)
      .json({ message: error.message || 'Gagal menghapus penugasan.' });
  }
};
