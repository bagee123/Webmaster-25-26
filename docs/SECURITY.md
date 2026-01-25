# Security

Security features and validation improvements.

---

## Overview

| Feature | Status |
|---------|--------|
| Email Validation | RFC 5322 compliant |
| Password Strength | Meter + requirements |
| Email Verification | Firebase verification |
| Phone Validation | libphonenumber-js |
| Input Sanitization | All form fields |
| Keyboard Navigation | ARIA compliant |

---

## Email Validation

**Functions:** `src/utils/validation.js`

```javascript
isValidEmail(email)       // Basic format
isValidEmailStrict(email) // RFC 5322 strict
sanitizeEmail(email)      // Trim + lowercase
```

**Features:**
- RFC 5322 compliant regex
- Firebase email verification on signup
- Sanitization before storage

---

## Password Requirements

**Component:** `src/components/PasswordStrengthMeter.jsx`

Requirements:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

**Strength Levels:**
- 🔴 Weak (0-1 requirements)
- 🟠 Fair (2 requirements)
- 🟡 Good (3 requirements)
- 🟢 Strong (4+ requirements)

```javascript
const { isValid, strength, requirements } = validatePassword(password);
```

---

## Phone Validation

**Library:** libphonenumber-js

```javascript
validatePhoneNumber(phone)
// Returns: { isValid, formatted, error }
```

Formats: `(972) 962-4311`, `972-962-4311`, `9729624311`

US format with automatic formatting on valid input.

---

## Accessibility (WCAG 2.1)

**Keyboard Navigation:**
- All elements Tab-accessible
- Escape closes menus
- Enter/Space activates buttons
- Focus indicators visible

**ARIA Labels:**
```jsx
<nav role="navigation" aria-label="Main navigation">
<button aria-expanded={isOpen} aria-controls="menu">
<div role="alertdialog" aria-labelledby="title">
```

**Screen Reader Support:**
- Descriptive button labels
- Current page indicated
- Form labels associated

---

## Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read, admin write
    match /blog/{doc} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }
    
    // User-specific data
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Public submissions
    match /submissions/{doc} {
      allow create: if true;
    }
  }
}
```

---

## Input Sanitization

All user inputs sanitized before storage:

```javascript
sanitizeEmail(email)  // Trim, lowercase
sanitizeName(name)    // Trim, normalize spaces
```

Prevents injection attacks and ensures data consistency.

---

## XSS Protection

- React escapes output by default
- No `dangerouslySetInnerHTML` without sanitization
- Content Security Policy headers (via Netlify)

---

## Form Validation

**Signup Form:**
```
Name: 2-50 chars, letters/spaces/hyphens
Email: RFC 5322 format, max 254 chars
Password: 8+ chars with requirements
```

**Contact Form:**
```
Name: 2-50 chars
Email: RFC 5322 format
Phone: Optional, 10-digit US format
Subject: 3+ chars
Message: 10-5000 chars
```

---

## Mobile Responsiveness

**Breakpoints:**
- Mobile: < 480px
- Tablet: 480px - 640px
- Desktop: > 1024px

**Touch-Friendly:**
- Minimum 44x44px tap targets
- Adequate spacing
- No hover-only functionality

---

## Environment Security

- `.env` files excluded from Git
- Production keys separate from development
- API keys restricted by domain
- Secrets in CI/CD environment variables

---

## Testing Checklist

**Email:**
- ✅ `test@example.com`
- ❌ `invalid@`
- ❌ `test@domain`

**Password:**
- ❌ `abc` (too short)
- 🟡 `Abc12345` (no special char)
- ✅ `Abc123!@#` (strong)

**Phone:**
- ✅ `(972) 962-4311`
- ✅ `9729624311`
- ❌ `123`

**Keyboard:**
- Tab through page
- Escape closes menus
- Focus visible

---

## Related Docs

[COMPONENTS.md](./COMPONENTS.md) - Validation utilities
[DEPLOYMENT.md](./DEPLOYMENT.md) - Production security
