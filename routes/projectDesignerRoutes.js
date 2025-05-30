const express = require('express');
const router = express.Router();
const projectDesignerController = require('../controllers/projectDesignerController');
const protect = require('../middleware/authMiddleware');

router.post('/assign', protect, projectDesignerController.assignDesigner);

router.get(
  '/project/:projectID',
  projectDesignerController.getDesignersByProject
);
router.get(
  '/designer/:designerID',
  projectDesignerController.getProjectsByDesigner
);

router.delete('/:id', protect, projectDesignerController.removeAssignment);

module.exports = router;
