const express = require('express');
const auth = require('../middleware/auth');
const { getSideHustles, createSideHustle, updateSideHustle, deleteSideHustle } = require('../controllers/sideHustleController');
const router = express.Router();

router.use(auth);
router.get('/', getSideHustles);
router.post('/', createSideHustle);
router.put('/:id', updateSideHustle);
router.delete('/:id', deleteSideHustle);

module.exports = router;