// backend/src/middlewares/roles.js
function requireRole(...allowedRoles) {
  // returns middleware
  return (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
      // req.user.role should be a string
      const role = String(req.user.role || '').toLowerCase();
      const allowed = allowedRoles.map(r => String(r).toLowerCase());
      if (!allowed.includes(role)) {
        return res.status(403).json({ message: 'Insufficient role' });
      }
      return next();
    } catch (err) {
      console.error('requireRole error', err);
      return res.status(500).json({ message: 'Server error' });
    }
  };
}

module.exports = { requireRole };
