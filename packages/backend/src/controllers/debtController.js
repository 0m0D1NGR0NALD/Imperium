const { Debt } = require('../models');

exports.getDebts = async (req, res) => {
  try {
    const debts = await Debt.findAll({ where: { familyId: req.user.familyId } });
    res.json(debts);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createDebt = async (req, res) => {
  try {
    const debt = await Debt.create({ ...req.body, familyId: req.user.familyId });
    res.status(201).json(debt);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateDebt = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Debt.update(req.body, { where: { id, familyId: req.user.familyId } });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    const debt = await Debt.findOne({ where: { id } });
    res.json(debt);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteDebt = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Debt.destroy({ where: { id, familyId: req.user.familyId } });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.payoffStrategy = async (req, res) => {
  try {
    const debts = await Debt.findAll({ where: { familyId: req.user.familyId } });
    const avalanche = [...debts].sort((a,b) => b.interestRate - a.interestRate);
    const snowball = [...debts].sort((a,b) => a.balance - b.balance);
    res.json({ avalanche, snowball });
  } catch (err) { res.status(500).json({ error: err.message }); }
};