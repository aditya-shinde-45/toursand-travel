const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const standardHeaders = true;
const legacyHeaders = false;

const apiRateLimit = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders,
  legacyHeaders,
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
  },
});

const authRateLimit = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.LOGIN_RATE_LIMIT_MAX,
  standardHeaders,
  legacyHeaders,
  message: {
    success: false,
    error: 'Too many login attempts. Please try again later.',
  },
});

const bookingTrackRateLimit = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.TRACK_RATE_LIMIT_MAX,
  standardHeaders,
  legacyHeaders,
  message: {
    success: false,
    error: 'Too many tracking attempts. Please try again later.',
  },
});

const contactRateLimit = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.CONTACT_RATE_LIMIT_MAX,
  standardHeaders,
  legacyHeaders,
  message: {
    success: false,
    error: 'Too many contact requests. Please try again later.',
  },
});

module.exports = {
  apiRateLimit,
  authRateLimit,
  bookingTrackRateLimit,
  contactRateLimit,
};
