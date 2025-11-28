const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const chatCtrl = require('../controllers/chatController');

router.get('/conversation', auth, chatCtrl.getConversation);

module.exports = router;
