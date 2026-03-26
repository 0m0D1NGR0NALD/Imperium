const { Constitution } = require('../models');

exports.getConstitution = async (req, res) => {
  try {
    const constitution = await Constitution.findOne({ where: { familyId: req.user.familyId } });
    if (!constitution) return res.status(404).json({ error: 'Constitution not found' });
    res.json(constitution);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateConstitution = async (req, res) => {
  try {
    const [updated] = await Constitution.update(req.body, {
      where: { familyId: req.user.familyId },
      returning: true
    });
    if (!updated) return res.status(404).json({ error: 'Constitution not found' });
    const constitution = await Constitution.findOne({ where: { familyId: req.user.familyId } });
    res.json(constitution);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};