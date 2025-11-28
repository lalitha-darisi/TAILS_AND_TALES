const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // your existing auth middleware
const ctrl = require('../controllers/notificationController');

router.get('/', auth, ctrl.getNotifications);
router.get('/unread-count', auth, ctrl.getUnreadCount);
router.put('/mark-read/:id', auth, ctrl.markAsRead);
router.put('/mark-all-read', auth, ctrl.markAllRead);

module.exports = router;
