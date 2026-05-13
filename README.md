# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
# Formvity

Branded form builder UI (React + TypeScript + Vite).

## Documentation

| Doc | Contents |
|-----|----------|
| [docs/README-USER-FEATURES.md](docs/README-USER-FEATURES.md) | Target maker/responder journeys (login, templates, publish link, responses), intake vs form fields, dev tools vs product, gaps from this repo, startup notes |
| [docs/README-BACKEND-APIs.md](docs/README-BACKEND-APIs.md) | API catalog, **getting started plan** (Spring Security last), **why/where** each API is used, MVP tables, and full endpoint reference |
| [docs/README-DATABASE-SCHEMA.md](docs/README-DATABASE-SCHEMA.md) | **Postgres tables**: `users`, `workspaces`, `workspace_members`, `forms`, `form_publications`, `submissions`, plus optional tables and DDL sketch |
