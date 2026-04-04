const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const constitutionRoutes = require('./routes/constitutionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const sideHustleRoutes = require('./routes/sideHustleRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const recurringRoutes = require('./routes/recurringRoutes');
// ... import other route files

// Load models to register them with Sequelize
require('./models');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/constitution', constitutionRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/side-hustles', sideHustleRoutes);
app.use('/api/investment', investmentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/recurring', recurringRoutes);
// ... add other routes

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// sequelize.sync({ alter: true }) // only for dev, use migrations in prod
//   .then(() => console.log('Database synced'))
//   .catch(err => console.error('DB sync error:', err));

sequelize.sync({ force: true }) // drop and recreate tables
  .then(() => console.log('Database synced'))
  .catch(err => console.error('DB sync error:', err));

module.exports = app;