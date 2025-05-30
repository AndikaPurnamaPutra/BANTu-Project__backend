const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const nameWithoutExt = path.basename(file.originalname, ext);
    const timestamp = Date.now();

    return {
      folder: 'portfolios',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi'],
      public_id: `${timestamp}-${nameWithoutExt}`,
    };
  },
});

const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

module.exports = uploadMiddleware;
