# Task Manager

Task Manager is a full-stack task tracking application with a React frontend and an Express backend. It supports account registration, session-based authentication, and a personal task dashboard with creation, editing, filtering, sorting, and completion tracking.

The repository is split into two runtime applications:

- `./`: Vite + React + TypeScript frontend
- `./server`: Express + Sequelize + MySQL backend

## What The App Does

- Registers and logs users in with email/password credentials
- Persists authentication with HTTP-only session cookies
- Restores the signed-in user on page refresh
- Lets each user create private tasks with title, description, priority, due date, and tag
- Lets users edit existing tasks from the task card action menu using the same form as task creation
- Separates active and completed tasks
- Supports search, status filtering, priority filtering, and sorting
- Tracks completion progress on the tasks page

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router 7
- Material UI 7
- Emotion
- Plain CSS files for global, page, and feature styling
- `classnames` for conditional styling

### Backend

- Node.js
- Express 4
- Sequelize 6
- MySQL
- `express-session`
- `connect-session-sequelize`
- `bcrypt`
- `cors`
- `dotenv`

## Architecture Overview

### Frontend

The client is organized by feature rather than by component type alone.

- `src/app`: application shell, providers, and router
- `src/pages`: route-level pages
- `src/features/auth`: auth UI, auth state, client validation, and auth API calls
- `src/features/tasks`: task UI, API calls, filtering/sorting logic, and page model
- `src/shared/api`: shared fetch wrapper with cookie credentials and centralized error handling
- `src/shared/types`: DTOs shared across the client
- `src/theme`: Material UI theme setup
- `src/styles`: global and page-specific styles

Authentication state is managed through `AuthProvider`, which restores the current session from `GET /api/me` and redirects on unauthorized responses.

Task creation and task editing share the same modal component. The tasks page model switches that modal between `create` and `edit` modes, preloads form values for edits, and persists updates through the tasks API client.

### Backend

The server is organized around modules plus shared infrastructure code.

- `server/config`: environment parsing and session configuration
- `server/modules/auth`: auth routes
- `server/modules/tasks`: task routes
- `server/repositories`: database access helpers
- `server/models`: Sequelize models and associations
- `server/middleware`: shared Express middleware
- `server/services`: session-related helpers
- `server/validators`: request validation
- `server/utils`: response serialization helpers

The server:

- reads environment variables from the root `.env`
- connects to MySQL through Sequelize
- syncs database tables on startup with `sequelize.sync({ alter: true })`
- stores Express sessions in the database
- exposes all API routes under `/api`

Task updates are handled by `PUT /api/tasks/:taskId`, which validates the full task payload, checks task ownership, and returns the serialized updated task.

## Project Structure

```text
task-manager/
├── README.md
├── package.json
├── vite.config.ts
├── shared/
│   └── auth.json
├── public/
│   └── users.json
├── src/
│   ├── app/
│   │   ├── providers/
│   │   └── router/
│   ├── assets/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── model/
│   │   │   └── utils/
│   │   └── tasks/
│   │       ├── api/
│   │       ├── components/
│   │       ├── lib/
│   │       └── model/
│   ├── pages/
│   ├── shared/
│   │   ├── api/
│   │   └── types/
│   ├── styles/
│   └── theme/
└── server/
    ├── app.js
    ├── db.js
    ├── index.js
    ├── package.json
    ├── config/
    ├── middleware/
    ├── models/
    ├── modules/
    │   ├── auth/
    │   └── tasks/
    ├── repositories/
    ├── services/
    ├── utils/
    └── validators/
```

## Shared Configuration

`shared/auth.json` is a single source of truth for authentication rules and auth-related messages used on both sides of the application.

Current shared auth rules:

- email must match the configured email regex
- password minimum length is `14`
- password must include at least `1` special character

## Getting Started

### Prerequisites

- Node.js
- npm
- MySQL database

### 1. Install Dependencies

Install frontend dependencies from the repository root:

```bash
npm install
```

Install backend dependencies inside `server/`:

```bash
cd server
npm install
```

### 2. Create `.env`

Create a root `.env` file in the repository root.

Example:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=task_manager
DB_USER=root
DB_PASSWORD=your_password
SESSION_SECRET=replace_this_in_real_environments
SERVER_PORT=3001
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 3. Start The Backend

From `server/`:

```bash
npm run dev
```

The API starts on `http://localhost:3001` by default.

### 4. Start The Frontend

From the repository root:

```bash
npm run dev
```

The Vite dev server starts on `http://localhost:5173` by default.

`vite.config.ts` proxies `/api` requests to `http://localhost:3001`, so the frontend can call the backend without changing API URLs during local development.

## Available Scripts

### Root

- `npm run dev`: start the Vite frontend dev server
- `npm run build`: type-check and build the frontend
- `npm run lint`: run ESLint
- `npm run preview`: preview the production frontend build

### `server/`

- `npm run dev`: start the backend with Node watch mode
- `npm start`: start the backend normally

## API Overview

All backend endpoints are mounted under `/api`.

### Auth

- `POST /api/register`
  - creates a user
  - hashes the password with `bcrypt`
  - signs the user into a session immediately
- `POST /api/login`
  - validates credentials
  - starts an authenticated session
- `GET /api/me`
  - returns the current signed-in user
  - requires authentication
- `POST /api/logout`
  - destroys the session and clears the session cookie

### Tasks

- `GET /api/tasks`
  - returns all tasks for the authenticated user
- `POST /api/tasks`
  - creates a new task for the authenticated user
- `PATCH /api/tasks/:taskId`
  - updates only the `completed` state for a task owned by the authenticated user

## Task Data Model

Tasks currently include:

- `id`
- `title`
- `description`
- `priority`: `high | medium | low`
- `dueDate`
- `createdAt`
- `tag`
- `completed`

On the database side, tasks belong to a user through `user_id`.

## Validation Rules

### Auth

- email and password are required
- email must match the shared regex pattern
- password must satisfy the shared minimum length and special-character rule

### Tasks

- all task fields are required when creating a task
- `priority` must be `high`, `medium`, or `low`
- `dueDate` must use `YYYY-MM-DD`
- `dueDate` cannot be in the past
- task completion updates must send a boolean `completed`

## Routing

The frontend currently exposes these routes:

- `/`: marketing/landing page
- `/login`: login form
- `/signup`: registration form
- `/tasks`: authenticated task dashboard

Route guards redirect:

- authenticated users away from `/login` and `/signup`
- unauthenticated users away from `/tasks`

## Notes

- The backend loads environment variables from the root `.env`, not from `server/.env`.
- Sessions are stored in MySQL through `connect-session-sequelize`.
- Session cookies are `httpOnly`, `sameSite: "lax"`, and become `secure` in production.
- The backend currently syncs database schema automatically on startup with `alter: true`, which is convenient for development but should be reviewed before production deployment.
