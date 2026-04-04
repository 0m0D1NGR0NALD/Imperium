const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Debt = sequelize.define('Debt', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  balance: { type: DataTypes.FLOAT, allowNull: false },
  interestRate: { type: DataTypes.FLOAT, defaultValue: 0 },
  minimumPayment: { type: DataTypes.FLOAT },
  dueDate: { type: DataTypes.DATE },
  type: { type: DataTypes.ENUM('credit_card', 'student_loan', 'mortgage', 'auto', 'other'), defaultValue: 'other' },
  familyId: { type: DataTypes.UUID, allowNull: false }
});

module.exports = Debt;