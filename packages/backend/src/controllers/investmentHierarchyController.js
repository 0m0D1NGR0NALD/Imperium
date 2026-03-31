const { InvestmentHierarchy } = require('../models');

const defaultSteps = [
  { step: 1, name: 'Eliminate High-Interest Debt' },
  { step: 2, name: 'Fund Emergency Reserve' },
  { step: 3, name: 'Maximise Tax-Advantaged & Pension Vehicles' },
  { step: 4, name: 'Invest in Low-Cost Index Funds' },
  { step: 5, name: 'Consider Advanced Assets' }
];

exports.getHierarchy = async (req, res) => {
  try {
    let steps = await InvestmentHierarchy.findAll({
      where: { familyId: req.user.familyId },
      order: [['step', 'ASC']]
    });
    if (steps.length === 0) {
      steps = await InvestmentHierarchy.bulkCreate(
        defaultSteps.map(step => ({ ...step, familyId: req.user.familyId }))
      );
    }
    res.json(steps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStep = async (req, res) => {
  try {
    const { stepId } = req.params;
    const { status } = req.body;
    const step = await InvestmentHierarchy.findOne({
      where: { id: stepId, familyId: req.user.familyId }
    });
    if (!step) return res.status(404).json({ error: 'Step not found' });
    await step.update({ status, completedAt: status === 'completed' ? new Date() : null });
    res.json(step);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};