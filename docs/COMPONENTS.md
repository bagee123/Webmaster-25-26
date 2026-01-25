# Components

Reusable UI components and utilities documentation.

---

## Toast System

Global notification system for user feedback.

**Setup:**
```jsx
// App.jsx
<ToastProvider>
  <YourApp />
  <ToastContainer />
</ToastProvider>
```

**Usage:**
```jsx
import { useToast } from '../context/ToastContext';

const { showSuccess, showError, showInfo, showWarning } = useToast();

showSuccess('Saved successfully!');
showError('Something went wrong');
showInfo('Check your email');
showWarning('Session expiring soon');
```

**Options:**
- `message` (string) - Notification text
- `duration` (number) - Auto-dismiss ms (default: 4000)

Features: Auto-dismiss, manual close, stacking, dark mode, mobile responsive.

---

## ErrorBoundary

Catches React errors and displays fallback UI.

```jsx
<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

Prevents blank pages on errors, logs to console, provides refresh/home options.

---

## ProtectedRoute

Restricts access to authenticated users.

```jsx
<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
```

Behavior: Authenticated → renders children, Not authenticated → redirects to `/login`.

---

## SearchBar

Reusable search input component.

```jsx
<SearchBar
  placeholder="Search resources..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>
```

Features: Clear button, search icon, focus states, dark mode.

---

## Navbar

Main navigation with mobile responsive menu.

Features:
- Desktop/mobile layouts
- User menu dropdown
- Dark mode toggle
- Keyboard accessible (ARIA labels)
- Admin link for admin users

Breakpoints: Mobile < 1024px, Desktop ≥ 1024px

---

## PasswordStrengthMeter

Visual password strength indicator.

```jsx
<PasswordStrengthMeter password={password} />
```

Shows: Strength bar (weak→strong), requirements checklist, color-coded feedback.

Requirements: 8+ chars, uppercase, lowercase, number, special char.

---

## PageHero

Consistent hero section for pages.

```jsx
<PageHero
  title="Resources"
  subtitle="Find community resources"
  backgroundImage="/images/hero.jpg"
/>
```

---

## CategoryFilter

Category selection with counts.

```jsx
<CategoryFilter
  categories={['All', 'Health', 'Education']}
  selected={selectedCategory}
  onChange={setSelectedCategory}
  counts={{ All: 50, Health: 20, Education: 30 }}
/>
```

---

## SortDropdown

Sorting options dropdown.

```jsx
<SortDropdown
  value={sortBy}
  onChange={setSortBy}
  options={[
    { value: 'newest', label: 'Newest First' },
    { value: 'name', label: 'Name A-Z' }
  ]}
/>
```

---

## Validation Utilities

Location: `src/utils/validation.js`

### Email
```javascript
isValidEmail(email)       // Basic format check
isValidEmailStrict(email) // RFC 5322 compliant
sanitizeEmail(email)      // Trim + lowercase
```

### Password
```javascript
validatePassword(password)
// Returns: { isValid, strength, requirements, message }
// strength: 'weak' | 'fair' | 'good' | 'strong'
```

### Phone
```javascript
validatePhoneNumber(phone)
// Returns: { isValid, formatted, error }
// Formats: (972) 962-4311
```

### Name
```javascript
validateName(name)
// Returns: { isValid, error }
// Rules: 2-50 chars, letters/spaces/hyphens/apostrophes
```

---

## Search Utilities

Location: `src/utils/searchUtils.js`

```javascript
// Normalize text for search
normalizeSearchText(text)

// Check if item matches query
matchesSearch(item, query, fields)

// Filter array by search + category
filterBySearch(items, query, category, categoryField, searchFields)

// Sort by relevance
sortByRelevance(items, query, searchFields)

// Get auto-complete suggestions
getSearchSuggestions(items, query, searchFields, maxSuggestions)
```

**Example:**
```javascript
const filtered = filterBySearch(
  resources,
  'health clinic',
  'Health',
  'category',
  ['name', 'description']
);
```

---

## ID Utilities

Location: `src/utils/idGenerator.js`

```javascript
generateUUID()        // Standard UUID v4
generateFirestoreID() // 20-char alphanumeric
generateResourceID()  // Context-appropriate
```

---

## Custom Hooks

### useScrollAnimation
```javascript
import { useScrollAnimation } from '../hooks/useScrollAnimation';

useScrollAnimation(); // Activates scroll animations
```

### useAuth
```javascript
const { user, isAuthenticated, login, logout, signup } = useAuth();
```

### useDarkMode
```javascript
const { isDarkMode, toggleDarkMode } = useDarkMode();
```

### useResources
```javascript
const { resources, userEvents, toggleUserEvent, addResource } = useResources();
```

### useToast
```javascript
const { showSuccess, showError, showInfo, showWarning } = useToast();
```

---

## PropTypes Pattern

All components use PropTypes for type checking:

```jsx
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number,
  items: PropTypes.arrayOf(PropTypes.object),
  onClick: PropTypes.func
};
```

---

## CSS Organization

Each component/page has dedicated CSS file:

```
src/css/
├── navbar.css
├── footer.css
├── toast.css
├── modal.css
├── card.css
└── [page].css
```

Dark mode: Use `.dark` class prefix or CSS variables.

---

## Related Docs

[ARCHITECTURE.md](./ARCHITECTURE.md) - System design
[SETUP.md](./SETUP.md) - Development setup
