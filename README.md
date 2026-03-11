# API Endpoints

All endpoints are prefixed with `/api`. Authentication is managed via HTTP-only session cookies.
Session data is persisted in the MySQL database through Sequelize. The server uses `express-session` for session management and `connect-session-sequelize` to store sessions in the database.

The server reads its database configuration from the root `.env` file:
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `SESSION_SECRET`
- `SERVER_PORT`

---

### `POST /api/register`

Register a new user.

**Request body:**
```json
{ "email": "user@example.com", "password": "yourPassword123!" }
```

**Responses:**
| Status | Description |
|--------|-------------|
| `201`  | User created, session started. Returns `{ success: true, user }` |
| `400`  | Missing fields or invalid email/password format |
| `409`  | Email already in use |
| `500`  | Server error |

---

### `POST /api/login`

Login with existing credentials.

**Request body:**
```json
{ "email": "user@example.com", "password": "yourPassword123!" }
```

**Responses:**
| Status | Description |
|--------|-------------|
| `200`  | Login successful. Returns `{ success: true, user }` |
| `400`  | Missing fields or invalid email/password format |
| `401`  | Invalid credentials |
| `500`  | Server error |

---

### `GET /api/me`

Get the currently authenticated user.

**Responses:**
| Status | Description |
|--------|-------------|
| `200`  | Returns `{ user }` |
| `401`  | Not authenticated |
| `500`  | Server error |

---

### `POST /api/logout`

Destroy the current session.

**Responses:**
| Status | Description |
|--------|-------------|
| `200`  | Returns `{ success: true }` |
| `500`  | Server error |

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
