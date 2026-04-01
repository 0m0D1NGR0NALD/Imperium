const User = require('./User');
const Family = require('./Family');
const Constitution = require('./Constitution');
const Budget = require('./Budget');
const Account = require('./Account');
const Transaction = require('./Transaction');
const SideHustle = require('./SideHustle');
const InvestmentHierarchy = require('./InvestmentHierarchy');

// Associations
Family.hasMany(User);
User.belongsTo(Family);

Family.hasOne(Constitution);
Constitution.belongsTo(Family);

Family.hasOne(Budget);
Budget.belongsTo(Family);

Family.hasMany(Account);
Account.belongsTo(Family);

Family.hasMany(Transaction);
Transaction.belongsTo(Family);
Account.hasMany(Transaction);
Transaction.belongsTo(Account);

Family.hasMany(SideHustle);
SideHustle.belongsTo(Family);

Family.hasMany(InvestmentHierarchy);
InvestmentHierarchy.belongsTo(Family);

module.exports = {
  User,
  Family,
  Constitution,
  Budget,
  Account,
  Transaction,
  SideHustle,
  InvestmentHierarchy
};