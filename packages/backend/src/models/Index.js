const User = require('./User');
const Family = require('./Family');
const Constitution = require('./Constitution');
const Budget = require('./Budget');
const Account = require('./Account');

// Relationships
Family.hasMany(User);
User.belongsTo(Family);

Family.hasOne(Constitution);
Constitution.belongsTo(Family);

Family.hasOne(Budget);
Budget.belongsTo(Family);

Family.hasMany(Account);
Account.belongsTo(Family);

module.exports = { User, Family, Constitution, Budget, Account };