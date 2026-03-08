const app = require('./app');
const env = require('./config/env');
const { checkDatabaseConnection } = require('./config/db');
const { verifyEmailServer } = require('./config/mailer');

async function bootstrap() {
  try {
    await checkDatabaseConnection();
    console.log('✅ Connected to Supabase PostgreSQL database');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }

  const email = await verifyEmailServer();
  if (email.ok) {
    console.log('✅ Email server connected');
  } else {
    console.error('❌ Email server connection failed:', email.message);
    console.log('ℹ️ For Gmail, use a Google App Password (16 chars), not account password.');
  }

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
    console.log(`📍 API: http://localhost:${env.PORT}/api`);
  });
}

bootstrap();
