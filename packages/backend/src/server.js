const app = require('./app');

const PORT = process.env.PORT || 5000;

const cron = require('node-cron');
const { processRecurring } = require('./controllers/recurringController');
cron.schedule('0 0 * * *', () => { // every day at midnight
  processRecurring({ user: { familyId: null } }, { json: () => {} }); // simplified; need proper request mock
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});