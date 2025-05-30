const jwt = require('jsonwebtoken');

const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    req.user = undefined; // tidak ada token, lanjut tanpa user
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch {
    req.user = undefined; // token invalid tetap lanjut
    next();
  }
};

module.exports = optionalAuth;
