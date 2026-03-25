# Task Manager

Task Manager is a full-stack task tracking application with a Vite + React + TypeScript frontend and an Express + Sequelize + MySQL backend. It supports account registration, session-based authentication, private task management, a deadline calendar, and public task sharing.

The repository is split into three main parts:

- `./`: Vite + React + TypeScript frontend
- `./server`: Express + Sequelize + MySQL backend
- `./shared`: configuration shared between client and server

## What the App Does

- Serves a landing page at `/` plus dedicated `/login` and `/signup` screens
- Registers and logs users in with email/password credentials
- Persists authentication with HTTP-only session cookies stored in MySQL
- Restores the signed-in user from `GET /api/me` on page refresh
- Lets each user create private tasks with title, description, priority, due date, tag, and subtasks
- Reuses the same modal for task creation and editing
- Lets users delete tasks from a confirmation dialog
- Supports per-subtask completion toggles and a per-task subtask progress bar
- Auto-completes a task when all subtasks are completed, and reopens it when any subtask is unchecked
- Separates active and completed tasks in the list view
- Supports search, priority filtering, status filtering, and sorting by due date, priority, or creation date in the list view
- Shows overall pending/done/total counts plus a progress bar on the tasks dashboard
- Provides a calendar view at `/tasks/calendar` for browsing tasks by due date
- Supports touch swipe month navigation in the calendar view
- Lets users generate a public share link for a task, copy it to the clipboard, and revoke it later
- Exposes a read-only public task page at `/shared/:shareToken`

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router 7
- Material UI 7
- Emotion
- SCSS (Sass)
- `classnames`

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

The client is organized by app shell, route pages, and feature folders.

- `src/app`: application shell, providers, router, and route guards
- `src/pages`: route-level pages
- `src/features/auth`: auth UI, auth state, client validation, and auth API calls
- `src/features/tasks`: task API calls, page model, list/calendar UI, filtering, and form helpers
- `src/shared/api`: shared fetch wrapper with cookie credentials and centralized error handling
- `src/shared/types`: client-side DTOs and request option types
- `src/styles`: SCSS entrypoint plus foundations, component partials, and page styles

`AuthProvider` restores the current session from `GET /api/me`, exposes `login`, `register`, and `logout` actions, and installs a centralized unauthorized handler that redirects users back to `/login`.

`useTasksPageModel` is the main tasks state layer. It:

- fetches tasks from the backend
- manages search/filter/sort state for the list view
- owns create/edit/delete modal state
- performs optimistic task and subtask completion updates
- creates and revokes share links
- exposes shared state to both the list view and calendar view

The list view renders the toolbar, active/completed sections, and overall progress. The calendar view renders a month grid, highlights days with due tasks, and shows the selected day's tasks in a side panel.

### Backend

The server is organized around modules plus shared infrastructure code.

- `server/config`: environment parsing and session configuration
- `server/modules/auth`: auth routes
- `server/modules/tasks`: task and public-share routes
- `server/repositories`: database access helpers
- `server/models`: Sequelize models and associations
- `server/middleware`: shared Express middleware
- `server/services`: session helpers
- `server/validators`: request validation
- `server/utils`: response serialization helpers

On startup, the backend:

- loads environment variables from the root `.env`
- authenticates against MySQL through Sequelize
- syncs application tables with `sequelize.sync({ alter: true })`
- syncs the session store table with `alter: true`
- configures CORS for `CLIENT_ORIGIN`
- mounts auth and task routes under `/api`

Public shared-task access is exposed before auth middleware at `GET /api/public/tasks/:shareToken`. All private task routes under `/api/tasks` require an authenticated session.

## Shared Configuration

`shared/auth.json` is the single source of truth for auth-related validation rules and messages used on both the frontend and backend.

Current shared auth rules:

- email must match the configured regex pattern
- password minimum length is `14`
- password must include at least `1` special character

## Getting Started

### Prerequisites

- Node.js
- npm
- MySQL

### 1. Install Frontend Dependencies

From the repository root:

```bash
npm install
```

### 2. Install Backend Dependencies

From `server/`:

```bash
npm install
```

### 3. Create the Root `.env`

Create a `.env` file in the repository root.

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

Notes:

- the backend reads this root `.env` file, not `server/.env`
- `CLIENT_ORIGIN` should match the frontend URL that will send cookies
- `NODE_ENV=production` enables `secure` session cookies

### 4. Start the Backend

From `server/`:

```bash
npm run dev
```

The API starts on `http://localhost:3001` by default.

### 5. Start the Frontend

From the repository root:

```bash
npm run dev
```

The Vite dev server starts on `http://localhost:5173` by default.

`vite.config.ts` proxies `/api` requests to `http://localhost:3001`, so local frontend code can call the backend without changing request URLs.

## Available Scripts

### Root

- `npm run dev`: start the Vite frontend dev server
- `npm run build`: type-check and build the frontend
- `npm run lint`: run ESLint
- `npm run lint:fix`: run ESLint with auto-fix
- `npm run preview`: preview the production frontend build

### `server/`

- `npm run dev`: start the backend with Node watch mode
- `npm start`: start the backend normally

## Routing

The frontend currently exposes these routes:

- `/`: landing page
- `/login`: login form
- `/signup`: registration form
- `/tasks`: authenticated list dashboard
- `/tasks/calendar`: authenticated calendar dashboard
- `/shared/:shareToken`: public read-only shared task page

Route guards redirect:

- authenticated users away from `/login` and `/signup`
- unauthenticated users away from `/tasks` and `/tasks/calendar`
- shared task pages remain public

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
  - destroys the session
  - clears the session cookie

### Public Tasks

- `GET /api/public/tasks/:shareToken`
  - returns a read-only serialized task for a valid share token
  - does not require authentication

### Tasks

- `GET /api/tasks`
  - returns all tasks with subtasks for the authenticated user
- `POST /api/tasks`
  - creates a task with optional subtasks for the authenticated user
- `POST /api/tasks/:taskId/share`
  - generates a unique public share token for the authenticated user's task
- `DELETE /api/tasks/:taskId/share`
  - revokes the current public share token for the authenticated user's task
- `PUT /api/tasks/:taskId`
  - replaces editable task fields and syncs subtasks for a task owned by the authenticated user
- `PATCH /api/tasks/:taskId`
  - updates only the `completed` state for a task owned by the authenticated user
- `PATCH /api/tasks/:taskId/subtasks/:subtaskId`
  - toggles the `completed` state of a subtask
  - auto-completes the parent task when all subtasks are done
  - reopens the parent task when any subtask becomes incomplete
- `DELETE /api/tasks/:taskId`
  - deletes a task and its subtasks owned by the authenticated user

## Data Models

### User

- `id`
- `email`
- `createdAt`

The password hash is stored server-side as `password_hash` and is never returned to the client.

### Task

- `id`
- `title`
- `description` (empty string on the client when absent)
- `priority`: `high | medium | low`
- `dueDate` (empty string on the client when absent)
- `createdAt`
- `tag` (empty string on the client when absent)
- `completed`
- `shareToken` (`string | null`)
- `subtasks`

On the database side, tasks belong to a user through `user_id` and store the public share token in `share_token`.

### Subtask

- `id`
- `title`
- `completed`

On the database side, subtasks belong to a task through `task_id` and are cascade-deleted when the parent task is removed.

## Validation Rules

### Auth

- email and password are required
- email must match the shared regex pattern
- password must satisfy the shared minimum-length and special-character rules

### Tasks

- `title` is required
- `priority` must be `high`, `medium`, or `low`
- `description`, `dueDate`, and `tag` are optional
- `dueDate`, when provided, must use `YYYY-MM-DD` and cannot be in the past
- `POST /api/tasks` accepts `subtasks` as a string array; blank items are trimmed out
- `PUT /api/tasks/:taskId` accepts `subtasks` as `{ id?: number; title: string }[]`
- subtasks omitted from a task update are removed during sync
- task completion updates must send a boolean `completed`
- subtask completion updates must send a boolean `completed`
- public share links must use a valid 48-character hex token

## Notes

- Session cookies are `httpOnly`, `sameSite: "lax"`, have a 30-day max age, and become `secure` in production.
- Sessions are stored in MySQL through `connect-session-sequelize`.
- The backend currently syncs database schema automatically on startup with `alter: true`, which is convenient for development but should be reviewed before production deployment.
- The list dashboard includes search/filter/sort controls, while the calendar dashboard is focused on due-date navigation and day-level task review.
