const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/medicalController');

router.post('/', auth, ctrl.createRecord);
router.get('/pet/:petId', auth, ctrl.getForPet);
router.delete('/:id', auth, ctrl.deleteRecord);

module.exports = router;
