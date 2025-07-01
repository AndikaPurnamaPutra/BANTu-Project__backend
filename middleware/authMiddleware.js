// const jwt = require('jsonwebtoken');

// const protect = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   const isPublicProfileRoute = req.originalUrl.includes('/profile/'); // Rute profil publik

//   // Jika ini adalah rute profil publik, tidak perlu token
//   if (isPublicProfileRoute) {
//     return next();
//   }

//   if (!token) {
//     console.log('No token provided');
//     return res.status(401).json({ message: 'Not authorized, no token' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.userId || decoded.adminId; // Ambil userId dari token
//     next();
//   } catch (error) {
//     console.log('Token error:', error);
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ message: 'Token expired, please refresh' });
//     }
//     return res.status(401).json({ message: 'Not authorized, token failed' });
//   }
// };

// module.exports = protect;

// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware untuk mengautentikasi token JWT
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Mengambil token dari header 'Bearer <token>'

  if (!token) {
    // Jika tidak ada token, dan bukan rute yang secara eksplisit tidak memerlukan autentikasi
    // (misalnya rute profil publik yang tidak ada di sini, tapi dipertimbangkan sebelumnya)
    return res
      .status(401)
      .json({ message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Simpan seluruh payload token di req.user
    // Sehingga kita bisa mengakses req.user.userId dan req.user.role
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token error:', error); // Log error untuk debugging
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Token kedaluwarsa. Silakan login kembali.' });
    }
    return res.status(403).json({ message: 'Token tidak valid atau rusak.' });
  }
};

// Middleware untuk mengotorisasi peran pengguna
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Pastikan req.user ada dan memiliki properti role
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ message: 'Akses ditolak. Informasi peran tidak ditemukan.' });
    }
    // Periksa apakah peran pengguna ada di dalam daftar peran yang diizinkan
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: 'Anda tidak memiliki izin untuk mengakses ini.' });
    }
    next();
  };
};
