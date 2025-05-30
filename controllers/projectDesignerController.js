const ProjectDesigner = require('../models/ProjectDesigner');
const User = require('../models/User');
const Project = require('../models/Project');

exports.assignDesigner = async (req, res) => {
  try {
    const { projectID, designerID } = req.body;

    // Validasi project exist
    const project = await Project.findById(projectID);
    if (!project) return res.status(400).json({ message: 'Project not found' });

    // Validasi designer exist dan role designer
    const designer = await User.findById(designerID);
    if (!designer)
      return res.status(400).json({ message: 'Designer not found' });
    if (designer.role !== 'designer')
      return res.status(400).json({ message: 'User is not a designer' });

    // Cek apakah assignment sudah ada
    const exists = await ProjectDesigner.findOne({ projectID, designerID });
    if (exists)
      return res
        .status(400)
        .json({ message: 'Designer already assigned to this project' });

    const assignment = new ProjectDesigner({ projectID, designerID });
    await assignment.save();

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDesignersByProject = async (req, res) => {
  try {
    const projectID = req.params.projectID;
    const assignments = await ProjectDesigner.find({ projectID }).populate(
      'designerID',
      '-password'
    );
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectsByDesigner = async (req, res) => {
  try {
    const designerID = req.params.designerID;
    const assignments = await ProjectDesigner.find({ designerID }).populate(
      'projectID'
    );
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeAssignment = async (req, res) => {
  try {
    const { id } = req.params; // assignment id
    const assignment = await ProjectDesigner.findByIdAndDelete(id);
    if (!assignment)
      return res.status(404).json({ message: 'Assignment not found' });
    res.json({ message: 'Assignment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
