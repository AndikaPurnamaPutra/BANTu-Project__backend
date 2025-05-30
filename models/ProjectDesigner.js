const mongoose = require('mongoose');

const projectDesignerSchema = new mongoose.Schema({
  projectID: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  designerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ProjectDesigner', projectDesignerSchema);
