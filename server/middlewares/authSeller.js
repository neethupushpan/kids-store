const jwt = require("jsonwebtoken");

const authSeller = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "No token. User not authorized." });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // ✅ Check for seller role
    if (decodedToken.role !== 'seller' ){
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ message: "Authentication failed", error: error.message });
  }
};

module.exports = authSeller;
