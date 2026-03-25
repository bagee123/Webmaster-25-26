# Project Structure

Canonical repository structure and organization conventions for Coppell Community Hub.

---

## Top-Level Layout

```
CoppellCommunityHub/
├── docs/                # Technical and operational documentation
├── public/              # Static files copied directly into the build
├── scripts/             # One-off admin and data migration scripts
├── src/                 # Application source code
├── .env.example         # Environment variable template
├── .gitignore           # Ignore rules for secrets and generated files
├── firebase.json        # Firebase project config
├── firestore.rules      # Firestore security rules
├── netlify.toml         # Netlify deployment config
├── package.json         # Scripts and dependencies
└── vite.config.js       # Vite bundler config
```

---

## Source Layout (`src/`)

```
src/
├── assets/              # Images/icons imported by components/pages
├── components/          # Reusable UI building blocks
├── config/              # External service initialization (Firebase)
├── context/             # React context providers and hooks
├── css/                 # Global, component, and page styles
├── data/                # Static data and seed content
├── hooks/               # Reusable custom hooks
├── pages/               # Route-level page components
├── utils/               # Pure utilities (validation, helpers)
├── App.jsx              # Route shell + providers + top-level layout
└── main.jsx             # React app entry point
```

---

## Conventions

- `pages/` files are route-level and imported in `src/App.jsx` via `React.lazy` when possible.
- `components/` files should be reusable and avoid direct route coupling.
- CSS files live in `src/css/` and use existing naming style (`featureName.css`).
- Utility functions belong in `src/utils/` only when they are framework-agnostic or widely reused.
- One-off operational scripts remain in `scripts/` and must not be imported by the frontend.

---

## Repository Hygiene

- Never commit secrets (`serviceAccountKey.json`, `.env`, private keys).
- Never commit generated artifacts (`dist/`, caches, coverage outputs).
- Keep documentation links in `README.md` synchronized with `docs/`.

---

## Related Docs

- [SETUP.md](./SETUP.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [COMPONENTS.md](./COMPONENTS.md)
