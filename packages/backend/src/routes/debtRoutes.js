const express = require('express');
const auth = require('../middleware/auth');
const { getDebts, createDebt, updateDebt, deleteDebt, payoffStrategy } = require('../controllers/debtController');
const router = express.Router();

router.use(auth);
router.get('/', getDebts);
router.post('/', createDebt);
router.put('/:id', updateDebt);
router.delete('/:id', deleteDebt);
router.get('/payoff-strategy', payoffStrategy);
module.exports = router;