const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const constitutionRoutes = require('./routes/constitutionRoutes');
// ... import other route files

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/constitution', constitutionRoutes);
// ... add other routes

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

sequelize.sync({ alter: true }) // only for dev, use migrations in prod
  .then(() => console.log('Database synced'))
  .catch(err => console.error('DB sync error:', err));

module.exports = app;