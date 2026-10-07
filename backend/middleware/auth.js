const jwt = require("jsonwebtoken");

// Creates a JWT for a user. "role" is optional extra payload used by authMiddleware.
function signToken({ _id, secret, expireTime, role }) {
  return jwt.sign({ id: _id, role }, secret, { expiresIn: expireTime });
}

// Checks if a user has the admin permission
function isAdmin(user) {
  return !!user && user.role === "admin";
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function adminMiddleware(req, res, next) {
  if (!isAdmin({ role: req.userRole })) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

module.exports = authMiddleware;
module.exports.adminMiddleware = adminMiddleware;
module.exports.signToken = signToken;
module.exports.isAdmin = isAdmin;
