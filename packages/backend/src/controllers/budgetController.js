const { Budget } = require('../models');

exports.getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({ where: { familyId: req.user.familyId } });
    if (!budget) return res.status(404).json({ error: 'Budget not found' });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const { needsPercent, wantsPercent, savingsPercent } = req.body;
    if (needsPercent + wantsPercent + savingsPercent !== 100) {
      return res.status(400).json({ error: 'Percentages must sum to 100' });
    }
    const [updated] = await Budget.update(
      { needsPercent, wantsPercent, savingsPercent },
      { where: { familyId: req.user.familyId }, returning: true }
    );
    if (!updated) return res.status(404).json({ error: 'Budget not found' });
    const budget = await Budget.findOne({ where: { familyId: req.user.familyId } });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};