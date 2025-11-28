const User = require('../models/User');

exports.getProfile = async (req, res) => {
  res.json(req.user);
};

exports.updateProfile = async (req, res) => {
  try {
    const allowed = ['name','bio','avatarUrl'];
    allowed.forEach(k => {
      if (req.body[k] !== undefined) req.user[k] = req.body[k];
    });
    await req.user.save();
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.listUsers = async (req, res) => {
  const users = await User.find().select('-password').limit(100);
  res.json(users);
};
