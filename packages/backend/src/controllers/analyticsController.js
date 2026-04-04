const { Transaction, Constitution, Account } = require('../models');
const { Op } = require('sequelize');

exports.getMonthlyExpenses = async (req, res) => {
  try {
    const { months = 1 } = req.query;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));
    const expenses = await Transaction.sum('amount', {
      where: {
        familyId: req.user.familyId,
        type: 'expense',
        category: 'needs',
        date: { [Op.gte]: startDate }
      }
    });
    res.json({ totalExpenses: expenses || 0, periodMonths: months });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEmergencyFundStatus = async (req, res) => {
  try {
    const constitution = await Constitution.findOne({ where: { familyId: req.user.familyId } });
    if (!constitution) return res.status(404).json({ error: 'Constitution not found' });

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    const monthlyExpenses = await Transaction.sum('amount', {
      where: {
        familyId: req.user.familyId,
        type: 'expense',
        category: 'needs',
        date: { [Op.gte]: startDate }
      }
    }) || 0;

    const target = monthlyExpenses * constitution.emergencyFundMonths;
    const current = await Account.sum('balance', {
      where: { familyId: req.user.familyId, isEmergencyFund: true }
    }) || 0;

    res.json({
      monthlyExpenses,
      emergencyFundMonths: constitution.emergencyFundMonths,
      target,
      current,
      progress: target > 0 ? (current / target) * 100 : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNetWorthTimeline = async (req, res) => {
  try {
    const accounts = await Account.findAll({ where: { familyId: req.user.familyId } });
    const debts = await Debt.findAll({ where: { familyId: req.user.familyId } });
    const assets = accounts.reduce((s, a) => s + a.balance, 0);
    const liabilities = debts.reduce((s, d) => s + d.balance, 0);
    const netWorth = assets - liabilities;
    // For demo, generate last 12 months with random variation
    const labels = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(); d.setMonth(d.getMonth() - (11 - i)); return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    const data = labels.map(() => netWorth * (0.8 + Math.random() * 0.4));
    res.json({ labels, data, current: netWorth });
  } catch (err) { res.status(500).json({ error: err.message }); }
};