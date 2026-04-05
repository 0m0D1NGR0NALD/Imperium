const crypto = require('crypto');
const { Family, User } = require('../models');

exports.generateInviteCode = async (req, res) => {
  try {
    const family = await Family.findByPk(req.user.familyId);
    if (!family) return res.status(404).json({ error: 'Family not found' });
    const code = crypto.randomBytes(4).toString('hex');
    await family.update({ inviteCode: code });
    res.json({ inviteCode: code });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.joinFamily = async (req, res) => {
  try {
    const { code } = req.body;
    const family = await Family.findOne({ where: { inviteCode: code } });
    if (!family) return res.status(404).json({ error: 'Invalid code' });
    const user = await User.findByPk(req.userId);
    await user.update({ familyId: family.id });
    res.json({ message: 'Joined family' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};