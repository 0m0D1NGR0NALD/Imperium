const { Transaction, Account } = require('../models');
const { Op } = require('sequelize');

exports.getTransactions = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = { familyId: req.user.familyId };
    if (startDate && endDate) {
      where.date = { [Op.between]: [startDate, endDate] };
    }
    const transactions = await Transaction.findAll({
      where,
      include: [{ model: Account, attributes: ['name', 'type'] }],
      order: [['date', 'DESC']]
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { amount, date, description, category, type, accountId } = req.body;
    // Verify account belongs to family
    const account = await Account.findOne({ where: { id: accountId, familyId: req.user.familyId } });
    if (!account) return res.status(400).json({ error: 'Account not found' });
    const transaction = await Transaction.create({
      amount,
      date,
      description,
      category,
      type,
      accountId,
      familyId: req.user.familyId
    });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Transaction.update(req.body, {
      where: { id, familyId: req.user.familyId },
      returning: true
    });
    if (!updated) return res.status(404).json({ error: 'Transaction not found' });
    const transaction = await Transaction.findOne({ where: { id } });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Transaction.destroy({ where: { id, familyId: req.user.familyId } });
    if (!deleted) return res.status(404).json({ error: 'Transaction not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};