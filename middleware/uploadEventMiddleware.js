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

    let folder = 'events/';
    if (file.fieldname === 'thumbnail') folder += 'thumbnails';
    else if (file.fieldname === 'multimedia') folder += 'dokumentasi';
    else folder += 'others';

    return {
      folder,
      allowed_formats: [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'mp4',
        'mov',
        'avi',
        'mkv',
      ],
      public_id: `${timestamp}-${nameWithoutExt}`,
    };
  },
});

const uploadEventMiddleware = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
}).fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'multimedia', maxCount: 10 },
]);

module.exports = uploadEventMiddleware;
