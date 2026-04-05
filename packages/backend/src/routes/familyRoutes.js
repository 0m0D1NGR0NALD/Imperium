const express = require('express');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const attachFamily = require('../middleware/attachFamily');
const { Family, User } = require('../models');

const router = express.Router();

// All routes require authentication and family context
router.use(auth);
router.use(attachFamily); // attaches req.user and req.user.familyId

// Generate a new invite code for the family (admin only)
router.post('/generate-invite-code', async (req, res) => {
  try {
    const family = await Family.findByPk(req.user.familyId);
    if (!family) return res.status(404).json({ error: 'Family not found' });
    // Only family admin can generate code (optional: check role)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can generate invite codes' });
    }
    const code = crypto.randomBytes(4).toString('hex');
    await family.update({ inviteCode: code });
    res.json({ inviteCode: code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Join a family using an invite code (for logged-in user without a family)
router.post('/join-family', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Invite code required' });
    const family = await Family.findOne({ where: { inviteCode: code } });
    if (!family) return res.status(404).json({ error: 'Invalid invite code' });
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // If user already has a family, they cannot join another unless they leave first (optional)
    if (user.familyId) {
      return res.status(400).json({ error: 'You are already in a family. Leave first.' });
    }
    await user.update({ familyId: family.id });
    // Optionally, set role as 'member' (not admin)
    await user.update({ role: 'member' });
    res.json({ message: 'Joined family successfully', familyId: family.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Leave current family (user becomes family-less)
router.post('/leave-family', async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.familyId) return res.status(400).json({ error: 'You are not in a family' });
    // If user is the only admin, prevent leaving? optional
    await user.update({ familyId: null, role: 'member' });
    res.json({ message: 'Left family' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get family details (including members)
router.get('/family-details', async (req, res) => {
  try {
    const family = await Family.findByPk(req.user.familyId, {
      include: [{ model: User, attributes: ['id', 'email', 'firstName', 'lastName', 'role'] }]
    });
    if (!family) return res.status(404).json({ error: 'Family not found' });
    res.json(family);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;