# Repository Guidelines

## Project Structure & Module Organization
- `src/`: application source code. Main entry is `src/index.js`; UI and simulation logic currently live in `src/App.js`.
- `src/*.test.js`: unit/integration tests using React Testing Library (example: `src/App.test.js`).
- `public/`: static assets used by CRA (`index.html`, icons, manifest).
- `build/`: production output from `npm run build` (generated artifacts, do not edit manually).
- Root config is minimal and managed by Create React App via `package.json`.

## Build, Test, and Development Commands
- `npm start`: runs the app in development at `http://localhost:3000` with hot reload.
- `npm test`: starts Jest in watch mode through `react-scripts test`.
- `npm run build`: creates an optimized production bundle in `build/`.
- `npm run eject`: exposes CRA internals (one-way operation; avoid unless absolutely necessary).

## Coding Style & Naming Conventions
- Use 2-space indentation and semicolons in JavaScript files.
- Prefer functional React components and hooks (`useState`, `useEffect`, `useCallback`).
- Component files use PascalCase (`MicrofluidicSimulator`), variables/functions use camelCase, constants use UPPER_SNAKE_CASE when truly constant.
- Keep simulation logic readable: group related calculations and keep input/state keys consistently named (for example `qCell`, `qBead`, `qOil`).
- Linting follows CRA defaults via `eslintConfig` (`react-app`, `react-app/jest`).

## Testing Guidelines
- Testing stack: Jest + React Testing Library + `@testing-library/jest-dom`.
- Name tests as `*.test.js` and place next to the module under test in `src/`.
- Test user-visible behavior and core calculation paths; avoid testing internal implementation details.
- Run `npm test` locally before opening a PR. No strict coverage gate is configured, but new logic should include meaningful test coverage.

## Commit & Pull Request Guidelines
- Prefer concise, scoped commit messages. Existing history includes `fix:` prefixes (for example: `fix: ...`), so continue that style when applicable.
- Keep each commit focused on a single concern (logic change, test update, or docs).
- PRs should include: summary of changes, why they are needed, test evidence (`npm test` / manual checks), and screenshots/GIFs for UI changes.
- Link related issues/tasks when available and call out breaking behavior explicitly.
