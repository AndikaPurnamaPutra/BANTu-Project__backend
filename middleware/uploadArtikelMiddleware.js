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
      folder: 'artikels',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
      public_id: `${timestamp}-${nameWithoutExt}`,
    };
  },
});

const uploadArtikelMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = uploadArtikelMiddleware;
