const nodemailer = require('nodemailer');
const env = require('./env');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
    auth: env.SMTP_USER && env.SMTP_PASS
      ? {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        }
      : undefined,
  });

  return transporter;
}

async function verifyEmailServer() {
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    return {
      ok: false,
      message: 'SMTP credentials not configured',
    };
  }

  try {
    await getTransporter().verify();
    return { ok: true, message: 'Email server connected' };
  } catch (error) {
    return { ok: false, message: error.message };
  }
}

module.exports = {
  getTransporter,
  verifyEmailServer,
};
