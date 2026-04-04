const express = require('express');
const auth = require('../middleware/auth');
const { getRecurring, createRecurring, updateRecurring, deleteRecurring, processRecurring } = require('../controllers/recurringController');
const router = express.Router();

router.use(auth);
router.get('/', getRecurring);
router.post('/', createRecurring);
router.put('/:id', updateRecurring);
router.delete('/:id', deleteRecurring);
router.post('/process', processRecurring);
module.exports = router;