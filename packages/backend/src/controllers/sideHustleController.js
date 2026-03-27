const { SideHustle } = require('../models');

exports.getSideHustles = async (req, res) => {
  try {
    const sideHustles = await SideHustle.findAll({ where: { familyId: req.user.familyId } });
    res.json(sideHustles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSideHustle = async (req, res) => {
  try {
    const { name, monthlyIncome, profitAllocationPercent } = req.body;
    const sideHustle = await SideHustle.create({
      name,
      monthlyIncome,
      profitAllocationPercent,
      familyId: req.user.familyId
    });
    res.status(201).json(sideHustle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSideHustle = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await SideHustle.update(req.body, {
      where: { id, familyId: req.user.familyId },
      returning: true
    });
    if (!updated) return res.status(404).json({ error: 'Side hustle not found' });
    const sideHustle = await SideHustle.findOne({ where: { id } });
    res.json(sideHustle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSideHustle = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SideHustle.destroy({ where: { id, familyId: req.user.familyId } });
    if (!deleted) return res.status(404).json({ error: 'Side hustle not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};