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
