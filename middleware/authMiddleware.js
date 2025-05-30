const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const isPublicProfileRoute = req.originalUrl.includes('/profile/'); // Rute profil publik
  
  // Jika ini adalah rute profil publik, tidak perlu token
  if (isPublicProfileRoute) {
    return next();
  }

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId || decoded.adminId; // Ambil userId dari token
    next();
  } catch (error) {
    console.log('Token error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please refresh' });
    }
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = protect;
