<<<<<<< HEAD
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
=======
# local-events
Team 10

# Important Git Commands
- `git pull`: Get newest commit (update from repo)

## How to commit (add) something using command line (terminal)
1. `git add .`: This adds all modified/new files
2. `git commit -m "Commit message"`: Makes a commit with the message "Commit message"
3. `git push`: Pushes (Adds) the commit to the repo
    - If we decide to make certain branches, you can commit to one using `git push origin BRANCHNAME.`

# Running frontend
1. Open terminal, in visual studio code it is ctrl, shift and +, or:
    - Three dots on the top
    - Terminal
    - New terminal
2. Switch to the `frontend/vite-frontend` folder using `cd frontend/vite-frontend`
3. Run `npm i`: This installs all the required packages
4. Run `npm run dev`: This runs the react application.

To access it, go to the url which is in the terminal window, by default it should be `http://localhost:5173/`

# Running backend
1. Open terminal, in visual studio code it is ctrl, shift and +, or:
    - Three dots on the top
    - Terminal
    - New terminal
2. Switch to the `backend` folder using `cd backend`
3. Run `npm i`: This installs all the required packages.
4. Run `node server.js`: This runs the backend.
>>>>>>> ae40ecccb48f05963a05c39eceee7cd7776b982c
