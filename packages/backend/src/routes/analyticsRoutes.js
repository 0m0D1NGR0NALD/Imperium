const express = require('express');
const auth = require('../middleware/auth');
const { getMonthlyExpenses, getEmergencyFundStatus } = require('../controllers/analyticsController');
const router = express.Router();

router.use(auth);
router.get('/monthly-expenses', getMonthlyExpenses);
router.get('/emergency-fund', getEmergencyFundStatus);
router.get('/net-worth', getNetWorthTimeline);

module.exports = router;