# Coppell Community Hub

A community platform for Coppell residents to discover events, access resources, participate in forums, and stay connected with local happenings.

---

## Features

Events & Calendar - Browse and save upcoming community events
Resource Directory - Find vetted community resources (health, education, volunteering, etc.)
Community Forum - Discuss topics and share knowledge with neighbors
Blog & News - Stay informed with local news and announcements
User Authentication - Secure login with email verification and Google OAuth
Dark Mode - Light and dark theme support
Responsive Design - Works seamlessly on mobile, tablet, and desktop
Bookmarks - Save favorite events and resources for easy access

---

## Tech Stack

Frontend: React 19 | Build: Vite 7.2 | Router: React Router 7
Database: Firebase/Firestore | Auth: Firebase Auth
Styling: Tailwind CSS | Icons: Lucide React
Hosting: Netlify | Validation: Custom utilities

---

## Quick Start

### Prerequisites
Node.js v16+, npm v8+, Git

### Installation

```bash
git clone https://github.com/yourusername/CoppellCommunityHub.git
cd CoppellCommunityHub
npm install
npm run dev
```

Visit http://localhost:5173

### Firebase Setup

1. Create a Firebase project at console.firebase.google.com
2. Enable Authentication (Email/Password + Google)
3. Create Firestore database
4. Create `.env` file:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

See [SETUP.md](./docs/SETUP.md) for detailed instructions.

---

## Commands

```bash
npm run dev         Start dev server
npm run build       Create production build
npm run preview     Preview production build locally
npm run lint        Check code quality
```

---

## Project Structure

```
src/
├── pages/           Route pages (lazy-loaded)
├── components/      Reusable UI components
├── context/         State management (Auth, Theme, Toast, Resources)
├── utils/           Validation, ID generation, utilities
├── css/             Component and page styles
├── config/          Firebase configuration
└── assets/          Images and icons
```

---

## Key Features

Form Validation - RFC 5322 email validation, international phone numbers, password strength requirements, real-time field errors

User Feedback - Toast notifications for success/error/info messages, loading states on async operations, field validation errors, success confirmations

Performance - Code splitting (CSS reduced from 43KB to 21KB), lazy loading pages, service worker for offline support, intelligent caching, optimized builds

Security - Firebase security rules, email verification, input sanitization, password requirements, XSS protection

---

## Documentation

[ARCHITECTURE.md](./docs/ARCHITECTURE.md) - System design, data models, component structure
[COMPONENTS.md](./docs/COMPONENTS.md) - Component usage, hooks, validation utilities
[SETUP.md](./docs/SETUP.md) - Development setup, Firebase config
[DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Production deployment guide
[SECURITY.md](./docs/SECURITY.md) - Security features and validation
[FIRESTORE_INDEXES.md](./docs/FIRESTORE_INDEXES.md) - Database performance indexes

---

## Deployment

### Netlify (Recommended)

Option 1: GitHub Integration
1. Push to GitHub
2. Connect repo to Netlify dashboard
3. Set build: `npm run build`
4. Set publish: `dist`
5. Add environment variables
6. Auto-deploys on push

Option 2: Manual
```bash
npm run build
# Drag dist/ to Netlify
```

---

## Performance

Initial Load: 1.31 KB (gzip)
CSS Bundle: 21.82 KB (gzip)
JS Bundle: 6.31 KB (gzip)
Code Splitting: 23 chunks
Offline Support: Service Worker

---

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Commit: `git commit -m "description"`
4. Push: `git push origin feature/name`
5. Open a pull request

Code Standards: Match existing style, add PropTypes, include loading states, use Toast for feedback, test on mobile and desktop.

---

## Troubleshooting

Port in use? `npm run dev -- --port 3000`

Firebase not connecting? Check .env credentials and verify Firebase project has Authentication and Firestore enabled.

Styles not loading? Clear cache, restart dev server, check imports.

Build failing? Run `npm run lint`, check imports, clear node_modules.

See [SETUP.md](./docs/SETUP.md) for more help.

---

## License

Created for the Coppell community.

---

## Team

Coppell Team 2003-1 for TSA Webmaster Competition

---

## Support

Email: info@coppellcommunityhub.com
Contact Form: [Send Message](/#/contact)
Issues: [GitHub Issues](../../issues)
