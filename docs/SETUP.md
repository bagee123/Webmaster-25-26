# Setup Guide

Development environment and configuration instructions.

---

## Prerequisites

Node.js 16+ | npm 8+ | Git | Firebase Account | VS Code (recommended)

---

## Quick Start

```bash
git clone https://github.com/yourusername/CoppellCommunityHub.git
cd CoppellCommunityHub
npm install
npm run dev
```

Visit http://localhost:5173

---

## Environment Variables

Create `.env` file in project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Never commit `.env` files** - already in `.gitignore`.

Copy from template: `cp .env.example .env`

---

## Firebase Setup

### 1. Create Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project
3. Copy config to `.env` file

### 2. Enable Authentication
- Email/Password
- Google (optional)

### 3. Create Firestore Database
- Start in production mode
- Choose nearest region

### 4. Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read
    match /events/{doc} { allow read: if true; }
    match /resources/{doc} { allow read: if true; }
    match /blog/{doc} { allow read: if true; }
    
    // Authenticated write
    match /submissions/{doc} { allow create: if true; allow read: if request.auth != null; }
    match /contactSubmissions/{doc} { allow create: if true; allow read: if request.auth != null; }
    
    // User-specific
    match /users/{userId} { allow read, write: if request.auth.uid == userId; }
  }
}
```

---

## Commands

```bash
npm run dev       # Start dev server (port 5173)
npm run build     # Production build to dist/
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## Project Structure

```
src/
├── components/   Reusable UI components
├── pages/        Route pages (lazy-loaded)
├── context/      React Context providers
├── utils/        Validation, helpers
├── css/          Stylesheets
├── config/       Firebase config
└── assets/       Images, icons
```

---

## Creating New Pages

1. Create `src/pages/YourPage.jsx`
2. Add route in `src/App.jsx`:

```jsx
const YourPage = lazy(() => import('./pages/YourPage'));

<Route path="/your-page" element={<YourPage />} />
```

3. Create `src/css/yourpage.css`

---

## Creating New Components

1. Create `src/components/YourComponent.jsx`
2. Add PropTypes:

```jsx
import PropTypes from 'prop-types';

export default function YourComponent({ title, count }) {
  return <div>{title}: {count}</div>;
}

YourComponent.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number
};
```

---

## Using Toast Notifications

```jsx
import { useToast } from '../context/ToastContext';

function MyComponent() {
  const { showSuccess, showError } = useToast();
  
  const handleSave = async () => {
    try {
      await saveData();
      showSuccess('Saved!');
    } catch {
      showError('Save failed');
    }
  };
}
```

---

## Form Validation

```jsx
import { isValidEmail, validatePassword, validatePhoneNumber } from '../utils/validation';

// Email
if (!isValidEmail(email)) {
  setError('Invalid email format');
}

// Password
const { isValid, strength, message } = validatePassword(password);

// Phone (optional field)
if (phone && !validatePhoneNumber(phone).isValid) {
  setError('Invalid phone format');
}
```

---

## Code Style

- Use functional components with hooks
- Add PropTypes for all props
- Include loading states for async operations
- Use Toast for user feedback
- Test on mobile and desktop
- Follow existing patterns

---

## Troubleshooting

**Port in use?**
```bash
npm run dev -- --port 3000
```

**Firebase not connecting?**
- Check `.env` credentials
- Verify Firebase project has Auth + Firestore enabled
- Check browser console for errors

**Styles not loading?**
- Clear browser cache
- Restart dev server
- Check CSS imports

**Build failing?**
- Run `npm run lint`
- Check import paths
- Delete `node_modules` and reinstall

---

## Related Docs

[ARCHITECTURE.md](./ARCHITECTURE.md) - System design
[COMPONENTS.md](./COMPONENTS.md) - Component APIs
[DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
