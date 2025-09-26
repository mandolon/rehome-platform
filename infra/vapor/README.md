# Vapor Readiness (No-Deploy)

- This repo is prepped for future Vapor migration. No deploy actions included.
- Fill secrets later via Vapor UI: `APP_KEY` , DB creds, `AWS_BUCKET` , `SQS_*` , `SESSION_DOMAIN` , `SANCTUM_STATEFUL_DOMAINS` .
- Env files committed here are **templates** only (no real secrets).
- Local dev remains unchanged (SQLite/MySQL per your `.env`).
