const { Account } = require('../models');

exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.findAll({ where: { familyId: req.user.familyId } });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAccount = async (req, res) => {
  try {
    const { name, type, balance, isEmergencyFund } = req.body;
    const account = await Account.create({
      name,
      type,
      balance,
      isEmergencyFund,
      familyId: req.user.familyId
    });
    res.status(201).json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Account.update(req.body, {
      where: { id, familyId: req.user.familyId },
      returning: true
    });
    if (!updated) return res.status(404).json({ error: 'Account not found' });
    const account = await Account.findOne({ where: { id } });
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Account.destroy({ where: { id, familyId: req.user.familyId } });
    if (!deleted) return res.status(404).json({ error: 'Account not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};