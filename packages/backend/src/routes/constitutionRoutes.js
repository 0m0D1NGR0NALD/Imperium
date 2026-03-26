const express = require('express');
const auth = require('../middleware/auth');
const { getConstitution, updateConstitution } = require('../controllers/constitutionController');
const router = express.Router();

router.use(auth);
router.get('/', getConstitution);
router.put('/', updateConstitution);

module.exports = router;