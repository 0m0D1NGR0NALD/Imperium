const express = require('express');
const auth = require('../middleware/auth');
const { getHierarchy, updateStep } = require('../controllers/investmentHierarchyController');
const router = express.Router();

router.use(auth);
router.get('/', getHierarchy);
router.put('/step/:stepId', updateStep);

module.exports = router;