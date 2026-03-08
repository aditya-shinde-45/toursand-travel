const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const apiRoutes = require('./routes');
const { apiRateLimit } = require('./middleware/rateLimit');

const app = express();

app.disable('x-powered-by');

if (env.TRUST_PROXY) {
  app.set('trust proxy', 1);
}

app.use(helmet());

const allowWildcardOrigin = env.CORS_ORIGIN === '*';
app.use(
  cors({
    origin: allowWildcardOrigin ? true : env.CORS_ORIGIN,
    credentials: !allowWildcardOrigin,
  }),
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', apiRateLimit);

app.get('/', (_req, res) => {
  res.json({ message: 'Backend is up', api: '/api' });
});

app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
