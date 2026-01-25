# Architecture

System design and technical documentation for Coppell Community Hub.

---

## Tech Stack

Frontend: React 19 | Vite 7.2 | React Router 7
Backend: Firebase/Firestore | Firebase Auth
Styling: Tailwind CSS | Custom CSS modules
Icons: Lucide React | Validation: libphonenumber-js

---

## Project Structure

```
src/
├── assets/          Static images and icons
├── components/      Reusable UI components
├── config/          Firebase configuration
├── context/         React Context (Auth, Theme, Toast, Resources)
├── css/             Stylesheets by component/page
├── data/            Static data files
├── hooks/           Custom React hooks
├── pages/           Route pages (lazy-loaded)
└── utils/           Validation, ID generation, utilities
```

---

## State Management

Context-based architecture with React Context API.

| Context | Purpose | Hook |
|---------|---------|------|
| AuthContext | User authentication state | `useAuth()` |
| DarkModeContext | Theme preference (light/dark) | `useDarkMode()` |
| ResourceContext | Resource/event data management | `useResources()` |
| ToastContext | Global notifications | `useToast()` |

---

## Data Flow

```
User Action → Component → Context → Firebase → State Update → Re-render
```

**Authentication Flow:**
```
Signup → Firebase Auth → Email Verification → Login → Protected Routes
```

**Data Flow:**
```
Component → useResources() → Firestore Query → Cache → UI Update
```

---

## Core Features

### Authentication
- Email/password with Firebase verification
- Google OAuth integration
- Protected routes via `<ProtectedRoute>`
- Session persistence with Firebase tokens

### Validation
- Email: RFC 5322 compliant
- Password: Strength meter with requirements
- Phone: International format via libphonenumber-js
- Name: 2-50 chars, letters/hyphens/apostrophes

### Performance
- Code splitting with React.lazy()
- CSS per-route splitting
- Service worker for offline support
- Image optimization utilities

### Security
- Input sanitization
- Firebase security rules
- XSS protection (React built-in)
- Email verification required

---

## Data Models

### contactSubmissions
```javascript
{ name, email, phone, subject, message, timestamp, status, read }
```

### submissions (Resources)
```javascript
{ firstName, lastName, resourceName, website, category, description, timestamp }
```

### users
```javascript
{ uid, email, displayName, photoURL, emailVerified, createdAt }
```

### blog
```javascript
{ title, excerpt, content, category, authorId, createdAt, status, image }
```

### events
```javascript
{ name, description, category, startDate, endDate, location, isFeatured }
```

### forumTopics
```javascript
{ title, content, category, authorId, createdAt, isPinned, tags }
```

---

## Component Hierarchy

```
<App>
  <ErrorBoundary>
    <ToastProvider>
      <AuthProvider>
        <ResourceProvider>
          <DarkModeProvider>
            <Navbar />
            <Routes />
            <Footer />
            <ToastContainer />
          </DarkModeProvider>
        </ResourceProvider>
      </AuthProvider>
    </ToastProvider>
  </ErrorBoundary>
</App>
```

---

## ID Generation

Prevent duplicate IDs with utility functions:

```javascript
generateUUID()        // UUID v4 for general use
generateFirestoreID() // 20-char Firestore-style ID
generateResourceID()  // Context-appropriate ID
```

---

## Routing

All pages lazy-loaded for code splitting:

```javascript
const Home = lazy(() => import('./pages/Home'));
const Events = lazy(() => import('./pages/Events'));
```

Protected routes require authentication:

```jsx
<Route path="/saved-items" element={<ProtectedRoute><SavedItems /></ProtectedRoute>} />
```

---

## Build Output

Vite with manual chunks for optimal splitting:

```
Initial Load: 1.31 KB (gzip)
CSS Bundle: 21.82 KB (gzip)
JS Bundle: 6.31 KB (gzip)
Total Chunks: 23
```

---

## Related Docs

[COMPONENTS.md](./COMPONENTS.md) - Component usage and APIs
[SETUP.md](./SETUP.md) - Development environment setup
[DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment guide
