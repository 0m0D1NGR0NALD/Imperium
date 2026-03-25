const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes will be added here

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;