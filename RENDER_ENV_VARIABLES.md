# Render Environment Variables Guide

This document details all environment variables used by the Job Queue System when deploying to **Render**.

## Environment Variable Summary Table

| Variable | Required | Secret? | Purpose | Value to enter on Render |
|----------|----------|---------|---------|--------------------------|
| `NODE_ENV` | Yes | No | Defines runtime environment mode | `production` |
| `LOG_LEVEL` | No | No | Log output verbosity level | `info` |
| `PORT` | No | No | HTTP server port | Set automatically by Render (defaults to `10000`) |
| `SHUTDOWN_TIMEOUT_MS` | No | No | Graceful shutdown timeout limit in ms | `30000` |
| `REDIS_URL` | Yes | Yes | Connection URL for Render Key Value (Redis) service | `<RENDER_REDIS_INTERNAL_URL>` (e.g. `redis://red-xxxx:6379`) |
| `BULLMQ_PREFIX` | No | No | Key prefix for BullMQ jobs in Redis | `job-queue` |
| `RATE_LIMIT_KEY_PREFIX` | No | No | Key prefix for rate limiting counters in Redis | `rate-limit` |
| `JWT_SECRET` | Yes | Yes | Secret key used to sign and verify JWT authentication tokens | `<GENERATE_SECRET>` (min 32 chars) |
| `JWT_EXPIRES_IN` | No | No | Duration before issued JWT tokens expire | `1h` (or `7d`) |
| `ADMIN_EMAIL` | Yes | No | Email address for initial admin account login | `<YOUR_ADMIN_EMAIL>` |
| `ADMIN_PASSWORD` | Yes | Yes | Bcrypt password hash for admin account authentication | `<BCRYPT_HASH>` (e.g., generated via bcrypt) |
| `MAIL_HOST` | Yes | No | Hostname of SMTP mail provider | `<YOUR_SMTP_HOST>` (e.g., `smtp.mailtrap.io`) |
| `MAIL_PORT` | No | No | Port for SMTP mail server | `587` |
| `MAIL_SECURE` | No | No | Set `true` for TLS (port 465) or `false` for STARTTLS | `false` |
| `MAIL_USER` | Yes | Yes | Username / API key for SMTP server | `<YOUR_SMTP_USER>` |
| `MAIL_PASS` | Yes | Yes | Password / API secret for SMTP server | `<YOUR_SMTP_PASSWORD>` |
| `MAIL_FROM` | No | No | Sender email address for outgoing emails | `<YOUR_SENDER_EMAIL>` |
| `CORS_ORIGINS` | No | No | Comma-separated list of allowed browser origins | `<YOUR_FRONTEND_URL>` (or blank for non-browser APIs) |
| `REPORT_SCHEDULE` | No | No | Cron schedule expression for automated daily report job | `0 9 * * *` |
| `REPORT_TIMEZONE` | No | No | Optional timezone identifier for report scheduler | `UTC` |
| `ENABLE_API_DOCS` | No | No | Expose Swagger UI at `/api-docs` | `false` |
| `ENABLE_BULL_BOARD` | No | No | Expose Bull Board UI at `/admin/queues` | `false` |

---

## Detailed Variable Descriptions

### 1. `NODE_ENV`
- **Why it is needed**: Enables production security defaults, JSON logging format, strict CORS, and security middleware logic.
- **Where used**: [`src/config/env.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/config/env.js), [`src/config/logger.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/config/logger.js), [`src/middleware/errorHandler.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/middleware/errorHandler.js), [`src/app.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/app.js).
- **Secret?**: No.
- **Render Value**: `production`
- **Difference**: In local dev it is `development`; on Render it must be `production`.

### 2. `LOG_LEVEL`
- **Why it is needed**: Controls log filtering threshold (`info`, `debug`, `error`, `warn`).
- **Where used**: [`src/config/logger.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/config/logger.js).
- **Secret?**: No.
- **Render Value**: `info`
- **Difference**: Same across local and Render.

### 3. `PORT`
- **Why it is needed**: Specifies which port the HTTP Express server listens on.
- **Where used**: [`src/config/env.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/config/env.js), [`server.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/server.js).
- **Secret?**: No.
- **Render Value**: Render automatically injects `PORT` (e.g. `10000`). Do not manually override unless needed.
- **Difference**: In local dev defaults to `3000`; on Render automatically set by platform.

### 4. `SHUTDOWN_TIMEOUT_MS`
- **Why it is needed**: Maximum time in milliseconds allowed for graceful shutdown before forcing exit.
- **Where used**: [`src/config/env.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/config/env.js), [`src/utils/gracefulApiShutdown.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/utils/gracefulApiShutdown.js).
- **Secret?**: No.
- **Render Value**: `30000`
- **Difference**: Same across environments.

### 5. `REDIS_URL`
- **Why it is needed**: Connects Express API, rate limiter, and BullMQ worker to Render's Key Value (Redis) database instance.
- **Where used**: [`src/config/env.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/config/env.js), [`src/config/redis.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/config/redis.js), [`src/config/bullmq.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/config/bullmq.js).
- **Secret?**: Yes.
- **Render Value**: `<RENDER_REDIS_INTERNAL_URL>` (Copied from Render Key Value **Internal Connection String**).
- **Difference**: Local uses `REDIS_HOST=localhost` & `REDIS_PORT=6379`; Render uses `REDIS_URL`.

### 6. `BULLMQ_PREFIX`
- **Why it is needed**: Namespaces BullMQ job queue keys in Redis.
- **Where used**: [`src/config/env.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/config/env.js), [`src/config/bullmq.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/config/bullmq.js).
- **Secret?**: No.
- **Render Value**: `job-queue`
- **Difference**: Same across environments.

### 7. `RATE_LIMIT_KEY_PREFIX`
- **Why it is needed**: Namespaces atomic rate limiting keys in Redis.
- **Where used**: [`src/config/env.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/config/env.js).
- **Secret?**: No.
- **Render Value**: `rate-limit`
- **Difference**: Same across environments.

### 8. `JWT_SECRET`
- **Why it is needed**: Cryptographically signs and verifies JWT authentication tokens. Must be at least 32 characters in production.
- **Where used**: [`src/config/env.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/config/env.js), [`src/middleware/auth.middleware.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/middleware/auth.middleware.js), [`src/services/auth/auth.service.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/services/auth/auth.service.js).
- **Secret?**: Yes.
- **Render Value**: `<GENERATE_SECRET>` (Random string at least 32 characters long).
- **Difference**: Must use a strong production secret on Render.

### 9. `JWT_EXPIRES_IN`
- **Why it is needed**: Specifies lifespan of issued JWT tokens.
- **Where used**: [`src/config/env.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/config/env.js).
- **Secret?**: No.
- **Render Value**: `1h` (or `7d`).
- **Difference**: Same across environments.

### 10. `ADMIN_EMAIL`
- **Why it is needed**: Email address for authentication.
- **Where used**: [`src/config/env.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/config/env.js), [`src/services/auth/auth.service.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/services/auth/auth.service.js).
- **Secret?**: No.
- **Render Value**: `<YOUR_ADMIN_EMAIL>`
- **Difference**: Can be your real admin email in production.

### 11. `ADMIN_PASSWORD`
- **Why it is needed**: Bcrypt hash checked during `POST /api/auth/login`. Must be a valid bcrypt hash string starting with `$2a$`, `$2b$`, or `$2y$`.
- **Where used**: [`src/config/env.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/config/env.js), [`src/services/auth/auth.service.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/services/auth/auth.service.js).
- **Secret?**: Yes.
- **Render Value**: `<BCRYPT_HASH>`
- **Difference**: Ensure it is a secure bcrypt hash generated for your chosen production password.

### 12. `MAIL_HOST`, `MAIL_PORT`, `MAIL_SECURE`, `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM`
- **Why it is needed**: Configures Nodemailer SMTP transport for sending background emails in the BullMQ worker.
- **Where used**: [`src/config/env.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/config/env.js), [`src/config/mail.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/config/mail.js), [`src/services/mail/email.service.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/services/mail/email.service.js).
- **Secret?**: `MAIL_USER` and `MAIL_PASS` are secret.
- **Render Value**: `<YOUR_SMTP_HOST>`, `587`, `false`, `<YOUR_SMTP_USER>`, `<YOUR_SMTP_PASSWORD>`, `<YOUR_SENDER_EMAIL>`
- **Difference**: Uses production SMTP credentials (e.g. SendGrid, Mailgun, AWS SES, or Mailtrap).

### 13. `CORS_ORIGINS`
- **Why it is needed**: Restricts allowed frontend origins for browser cross-origin requests.
- **Where used**: [`src/config/env.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/config/env.js), [`src/app.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/app.js).
- **Secret?**: No.
- **Render Value**: `<YOUR_FRONTEND_URL>` (e.g. `https://myfrontend.com`) or leave blank for non-browser API clients.
- **Difference**: Production limits access to designated domains.

### 14. `REPORT_SCHEDULE` & `REPORT_TIMEZONE`
- **Why it is needed**: Cron schedule for automated report generation.
- **Where used**: [`src/config/env.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/config/env.js), [`src/schedulers/email.scheduler.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/schedulers/email.scheduler.js).
- **Secret?**: No.
- **Render Value**: `0 9 * * *`
- **Difference**: Same across environments.

### 15. `ENABLE_API_DOCS` & `ENABLE_BULL_BOARD`
- **Why it is needed**: Controls whether Swagger UI (`/api-docs`) and Bull Board (`/admin/queues`) are enabled.
- **Where used**: [`src/config/env.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/config/env.js), [`src/app.js`](file:///c:/Users/hp/OneDrive/Desktop/Devlopment/Backend/Job%20Queue%20System/src/app.js).
- **Secret?**: No.
- **Render Value**: `false` (or `true` if restricted behind internal admin auth).
- **Difference**: Default to `false` in production for security.
