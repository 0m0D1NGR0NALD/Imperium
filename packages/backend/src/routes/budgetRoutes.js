const express = require('express');
const auth = require('../middleware/auth');
const { getBudget, updateBudget } = require('../controllers/budgetController');
const router = express.Router();

router.use(auth);
router.get('/', getBudget);
router.put('/', updateBudget);

module.exports = router;