# Aditya Tours Backend (Node.js + AWS Lambda)

## Quick setup

1. Copy env file:
   - `cp .env.example .env`
2. Add your real values in `.env`
3. Install deps:
   - `npm install`
4. Run local API:
   - `npm run dev`

## Serverless (AWS Lambda)

### Deploy
- `npm run deploy`

### CI smoke test
- `DATABASE_URL=postgres://test:test@localhost:5432/testdb JWT_SECRET=test-secret npm run smoke`

### Build Lambda zip
- `npm run build:lambda`
- Output: `.artifacts/aditya-tours-backend.zip`

### Remove stack
- `npm run remove`

### Local serverless testing
- `npm run offline`

## Health endpoint
- Local: `http://localhost:5000/api/health`
- Serverless: `https://<your-api-id>.execute-api.<region>.amazonaws.com/api/health`

## Important notes

- Use **Google App Password** for `SMTP_PASS`, not normal Gmail password.
- Rotate all secrets that were shared in plain text.
- Keep `.env` out of git.

## GitHub Actions deployment

The repository workflow builds a Lambda zip and updates the existing Lambda function `adityatoursandtravels` on every push to `master` when backend files change.

Configure these GitHub repository secrets before enabling production deploys:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `DATABASE_URL`
- `JWT_SECRET`
- `CORS_ORIGIN`
- `FRONTEND_URL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

Configure this optional GitHub repository secret if you keep the existing frontend deploy job:

- `VITE_API_URL`

The workflow performs two backend stages:

- build `.artifacts/aditya-tours-backend.zip`
- update Lambda configuration and code for the `adityatoursandtravels` Lambda in `ap-south-1`

To smoke-test a deployed API manually, run:

- `npm run smoke:remote -- https://your-api-base-url`
