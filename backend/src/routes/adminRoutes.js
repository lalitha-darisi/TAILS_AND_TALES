// const express = require('express');
// const router = express.Router();
// const { requireRole } = require('../middlewares/roles');
// const auth = require('../middlewares/auth');
// const analyticsService = require('../services/analyticsService');

// router.get('/analytics', auth, requireRole('admin'), async (req,res)=> {
//   const data = await analyticsService.getAdminAnalytics();
//   res.json(data);
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // your auth middleware that sets req.user
const { requireRole } = require('../middlewares/roles');
const { getAdminAnalytics } = require('../controllers/analyticsController');

router.get('/analytics', auth, requireRole('admin'), getAdminAnalytics);

module.exports = router;
