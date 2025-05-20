const jwt = require('jsonwebtoken');

const authAdmin = (req, res, next) => {
  try {
    // Check token from cookies or Authorization header
    const token =
      req.cookies.adminToken || // from admin login
      req.cookies.token ||      // fallback
      req.headers.authorization?.split(' ')[1];

    // No token
    if (!token) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decodedToken || decodedToken.role !== 'admin') {
      return res.status(401).json({ message: 'User not authorized' });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authAdmin;
