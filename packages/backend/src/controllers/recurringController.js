const { RecurringTransaction, Transaction, Account } = require('../models');
const { Op } = require('sequelize');

exports.getRecurring = async (req, res) => {
  try {
    const recurring = await RecurringTransaction.findAll({ where: { familyId: req.user.familyId } });
    res.json(recurring);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.createRecurring = async (req, res) => {
  try {
    const { amount, description, category, type, frequency, nextDate, accountId } = req.body;
    const recurring = await RecurringTransaction.create({ amount, description, category, type, frequency, nextDate, accountId, familyId: req.user.familyId });
    res.status(201).json(recurring);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateRecurring = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await RecurringTransaction.update(req.body, { where: { id, familyId: req.user.familyId } });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    const recurring = await RecurringTransaction.findOne({ where: { id } });
    res.json(recurring);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.deleteRecurring = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await RecurringTransaction.destroy({ where: { id, familyId: req.user.familyId } });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.processRecurring = async (req, res) => {
  try {
    const { RecurringTransaction, Transaction, Account, Family } = require('../models');
    const now = new Date();
    const recurringList = await RecurringTransaction.findAll({
      where: { nextDate: { [Op.lte]: now } }
    });
    let processed = 0;
    for (const rec of recurringList) {
      await Transaction.create({
        amount: rec.amount,
        date: now,
        description: rec.description,
        category: rec.category,
        type: rec.type,
        accountId: rec.accountId,
        familyId: rec.familyId
      });
      let next = new Date(rec.nextDate);
      switch (rec.frequency) {
        case 'daily': next.setDate(next.getDate() + 1); break;
        case 'weekly': next.setDate(next.getDate() + 7); break;
        case 'monthly': next.setMonth(next.getMonth() + 1); break;
        case 'yearly': next.setFullYear(next.getFullYear() + 1); break;
      }
      await rec.update({ nextDate: next });
      processed++;
    }
    if (res && res.json) res.json({ processed });
    else console.log(`Processed ${processed} recurring transactions`);
  } catch (err) {
    console.error('Recurring processing error:', err);
    if (res && res.status) res.status(500).json({ error: err.message });
  }
};