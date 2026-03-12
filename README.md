# Task Manager

Task Manager is a React + TypeScript frontend backed by an Express + Sequelize API. Authentication uses HTTP-only session cookies, and task data is stored per user in MySQL.

## Project Structure

- `src/features/auth`: auth UI, provider, validation helpers, and auth API calls
- `src/features/tasks`: task hooks, task API calls, and task form/filter logic
- `src/shared/api`: shared `fetch` wrapper with credentials, error parsing, and 401 handling
- `src/shared/types`: API-facing DTO types used by the client
- `server/routes`: Express route handlers split by domain
- `server/repositories`: Sequelize data access helpers
- `server/services`: session helpers
- `server/validators`: auth and task request validation helpers
- `shared/auth.json`: shared auth rules and auth-facing messages used by both client and server

## Environment

The server reads these values from the root `.env` file:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `SESSION_SECRET`
- `SERVER_PORT`

## Running Locally

Install dependencies in both packages:

```bash
npm install
cd server
npm install
```

Start the frontend from the repository root:

```bash
npm run dev
```

Start the backend from `server/`:

```bash
npm run dev
```

## Shared Auth Rules

Both the client and server read auth rules from `shared/auth.json`.

- Email must match the shared email pattern
- Password must be at least 14 characters
- Password must include at least 1 special character

## API

All endpoints are prefixed with `/api`.

### `POST /api/register`

Request body:

```json
{ "email": "user@example.com", "password": "yourPassword123!" }
```

Responses:

- `201`: `{ success: true, user }`
- `400`: missing fields or invalid email/password format
- `409`: email already registered
- `500`: server error

### `POST /api/login`

Request body:

```json
{ "email": "user@example.com", "password": "yourPassword123!" }
```

Responses:

- `200`: `{ success: true, user }`
- `400`: missing fields or invalid email/password format
- `401`: invalid credentials
- `500`: server error

### `GET /api/me`

Responses:

- `200`: `{ user }`
- `401`: unauthenticated
- `500`: server error

### `POST /api/logout`

Responses:

- `200`: `{ success: true }`
- `500`: server error

### `GET /api/tasks`

Responses:

- `200`: `{ tasks }`
- `401`: unauthenticated
- `500`: server error

### `POST /api/tasks`

Request body:

```json
{
  "title": "Draft roadmap",
  "description": "Prepare Q2 planning notes",
  "priority": "high",
  "dueDate": "2026-03-20",
  "tag": "planning"
}
```

Responses:

- `201`: `{ task }`
- `400`: invalid task payload
- `401`: unauthenticated
- `500`: server error
