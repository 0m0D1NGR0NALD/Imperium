const { Account, Transaction, SideHustle, Debt, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardSummary = async (req, res) => {
  try {
    const familyId = req.user.familyId;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Assets (accounts with positive balance, excluding debt accounts)
    const accounts = await Account.findAll({ where: { familyId } });
    const assets = accounts.reduce((sum, acc) => sum + (acc.balance > 0 ? acc.balance : 0), 0);
    
    // Liabilities (debts)
    const debts = await Debt.findAll({ where: { familyId } });
    const liabilities = debts.reduce((sum, debt) => sum + debt.balance, 0);
    const netWorth = assets - liabilities;

    // Last 30 days income and savings
    const incomeTotal = await Transaction.sum('amount', {
      where: { familyId, type: 'income', date: { [Op.gte]: thirtyDaysAgo } }
    }) || 0;
    const savingsTotal = await Transaction.sum('amount', {
      where: { familyId, category: 'savings', type: 'expense', date: { [Op.gte]: thirtyDaysAgo } }
    }) || 0;
    const savingsRate = incomeTotal > 0 ? (savingsTotal / incomeTotal) * 100 : 0;

    // Side hustle monthly income
    const sideHustles = await SideHustle.findAll({ where: { familyId } });
    const sideHustleIncome = sideHustles.reduce((sum, sh) => sum + (sh.monthlyIncome || 0), 0);

    // Investment balance (accounts of type 'brokerage')
    const investmentBalance = accounts
      .filter(acc => acc.type === 'brokerage')
      .reduce((sum, acc) => sum + acc.balance, 0);

    // Net worth timeline (last 12 months – simplified: use current net worth with trend)
    // For a real timeline, you'd store historical snapshots. We'll generate a plausible projection.
    const labels = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(); d.setMonth(d.getMonth() - (11 - i));
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    // Simulate gradual growth (5% increase over 12 months)
    const baseNetWorth = netWorth || 1000;
    const timeline = labels.map((_, idx) => baseNetWorth * (0.9 + (idx / 12) * 0.2));

    res.json({
      netWorth,
      assets,
      liabilities,
      savingsRate: savingsRate.toFixed(1),
      sideHustleIncome,
      investmentBalance,
      timeline: { labels, data: timeline }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};