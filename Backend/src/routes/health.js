const express = require('express');
const { checkDatabaseConnection } = require('../config/db');
const { verifyEmailServer } = require('../config/mailer');

const router = express.Router();

router.get('/health', async (_req, res) => {
  const result = {
    status: 'ok',
    services: {
      database: 'unknown',
      email: 'unknown',
    },
    timestamp: new Date().toISOString(),
  };

  try {
    await checkDatabaseConnection();
    result.services.database = 'connected';
  } catch (error) {
    result.services.database = 'failed';
    result.status = 'degraded';
  }

  const email = await verifyEmailServer();
  result.services.email = email.ok ? 'connected' : `failed: ${email.message}`;
  if (!email.ok) result.status = 'degraded';

  res.status(result.status === 'ok' ? 200 : 207).json(result);
});

module.exports = router;
