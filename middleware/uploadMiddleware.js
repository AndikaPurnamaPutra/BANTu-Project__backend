const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig'); // Pastikan ini mengarah ke file konfigurasi Cloudinary Anda

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const nameWithoutExt = path.basename(file.originalname, ext);
    const timestamp = Date.now();

    return {
      folder: 'portfolios', // Folder di Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi'],
      public_id: `${timestamp}-${nameWithoutExt}`,
    };
  },
});

const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // Batas ukuran file 20MB
});

module.exports = uploadMiddleware;
