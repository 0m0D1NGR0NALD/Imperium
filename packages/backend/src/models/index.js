const User = require('./User');
const Family = require('./Family');
const Constitution = require('./Constitution');
const Budget = require('./Budget');
const Account = require('./Account');
const Transaction = require('./Transaction');
const SideHustle = require('./SideHustle');
const InvestmentHierarchy = require('./InvestmentHierarchy');
const RecurringTransaction = require('./RecurringTransaction');

// Associations
Family.hasMany(User, { foreignKey: 'familyId' });
User.belongsTo(Family, { foreignKey: 'familyId' });

Family.hasOne(Constitution, { foreignKey: 'familyId' });
Constitution.belongsTo(Family, { foreignKey: 'familyId' });

Family.hasOne(Budget, { foreignKey: 'familyId' });
Budget.belongsTo(Family, { foreignKey: 'familyId' });

Family.hasMany(Account, { foreignKey: 'familyId' });
Account.belongsTo(Family, { foreignKey: 'familyId' });

Family.hasMany(Transaction, { foreignKey: 'familyId' });
Transaction.belongsTo(Family, { foreignKey: 'familyId' });

Account.hasMany(Transaction, { foreignKey: 'accountId' });
Transaction.belongsTo(Account, { foreignKey: 'accountId' });

Family.hasMany(SideHustle, { foreignKey: 'familyId' });
SideHustle.belongsTo(Family, { foreignKey: 'familyId' });

Family.hasMany(InvestmentHierarchy, { foreignKey: 'familyId' });
InvestmentHierarchy.belongsTo(Family, { foreignKey: 'familyId' });

Family.hasMany(RecurringTransaction, { foreignKey: 'familyId' });
RecurringTransaction.belongsTo(Family, { foreignKey: 'familyId' });

Account.hasMany(RecurringTransaction, { foreignKey: 'accountId' });
RecurringTransaction.belongsTo(Account, { foreignKey: 'accountId' });

module.exports = {
  User,
  Family,
  Constitution,
  Budget,
  Account,
  Transaction,
  SideHustle,
  InvestmentHierarchy,
  RecurringTransaction
};