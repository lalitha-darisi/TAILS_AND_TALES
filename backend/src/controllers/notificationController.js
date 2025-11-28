const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const items = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    console.error('getNotifications', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user: req.user._id, read: false });
    res.json({ count });
  } catch (err) {
    console.error('getUnreadCount', err);
    res.status(500).json({ message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const id = req.params.id;
    const notif = await Notification.findOneAndUpdate({ _id: id, user: req.user._id }, { $set: { read: true } }, { new: true });
    if (!notif) return res.status(404).json({ message: 'Notification not found' });
    res.json(notif);
  } catch (err) {
    console.error('markAsRead', err);
    res.status(500).json({ message: err.message });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { $set: { read: true } });
    res.json({ ok: true });
  } catch (err) {
    console.error('markAllRead', err);
    res.status(500).json({ message: err.message });
  }
};
