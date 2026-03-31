const { User } = require('../models');

module.exports = async (req, res, next) => {
  if (!req.userId) return res.status(401).json({ error: 'Unauthorized' });
  const user = await User.findByPk(req.userId);
  if (!user) return res.status(401).json({ error: 'User not found' });
  req.user = user;
  req.user.familyId = user.familyId;
  next();
};