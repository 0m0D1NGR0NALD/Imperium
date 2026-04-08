const cron = require('node-cron');
const { processRecurring } = require('../controllers/recurringController');

// Run every day at 2:00 AM
cron.schedule('0 2 * * *', async () => {
  console.log('Running recurring transaction processor...');
  // Mock request and response objects because processRecurring expects them
  const req = { user: { familyId: null } }; // Will process for all families
  const res = { json: (data) => console.log('Processed:', data), status: () => ({ json: () => {} }) };
  await processRecurring(req, res);
});