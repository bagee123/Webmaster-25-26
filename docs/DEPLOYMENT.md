# Deployment Guide

Production deployment instructions for Netlify, Vercel, and Firebase.

---

## Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] `npm run build` completes without errors
- [ ] `npm run lint` passes
- [ ] Firebase security rules updated
- [ ] API keys restricted to production domain
- [ ] All features tested locally

---

## Environment Setup

### 1. Create Production Environment

```bash
cp .env.example .env.production
```

### 2. Configure Variables

```env
VITE_FIREBASE_API_KEY=your_production_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ENV=production
```

**Never commit production credentials to Git.**

---

## Build

```bash
npm run build     # Creates dist/ folder
npm run preview   # Test production build locally
```

Output: Optimized, minified bundles in `dist/` directory.

---

## Netlify Deployment

### Option 1: Git Integration (Recommended)

1. Push code to GitHub
2. Connect repo in [Netlify Dashboard](https://netlify.com)
3. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables in Site Settings → Environment
5. Deploy triggers automatically on push

### Option 2: Manual Deploy

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### Netlify Config

Already configured in `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Vercel Deployment

### Git Integration

1. Import project at [vercel.com](https://vercel.com)
2. Select GitHub repository
3. Configure:
   - Framework: Vite
   - Build: `npm run build`
   - Output: `dist`
4. Add environment variables
5. Deploy

### CLI Deploy

```bash
npm install -g vercel
vercel --prod
```

---

## Firebase Configuration

### Security Rules

Update in Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /blog/{doc} { allow read: if true; allow write: if request.auth.token.admin == true; }
    match /resources/{doc} { allow read: if true; allow write: if request.auth.token.admin == true; }
    match /events/{doc} { allow read: if true; allow write: if request.auth.token.admin == true; }
    match /users/{uid} { allow read, write: if request.auth.uid == uid; }
    match /submissions/{doc} { allow create: if true; }
    match /contactSubmissions/{doc} { allow create: if true; }
  }
}
```

### API Key Restrictions

1. Firebase Console → Project Settings → API Keys
2. Edit key → HTTP referrers
3. Add: `https://yourdomain.com/*`

---

## Performance Optimization

### Caching (Netlify)

Add to `netlify.toml`:

```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Bundle Analysis

```bash
npm run build -- --analyze
```

---

## Post-Deployment Verification

- [ ] All pages load correctly
- [ ] Authentication works (login/signup)
- [ ] Forms submit successfully
- [ ] Search and filtering work
- [ ] Mobile navigation works
- [ ] No console errors
- [ ] HTTPS enabled

---

## Rollback

### Netlify
1. Dashboard → Deploys
2. Select previous deploy
3. Click "Publish deploy"

### Vercel
1. Dashboard → Deployments
2. Click previous deployment
3. Promote to production

---

## Monitoring

### Error Tracking (Optional)

Add Sentry:

```bash
npm install @sentry/react
```

```jsx
// main.jsx
import * as Sentry from "@sentry/react";
Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN });
```

### Analytics (Optional)

Add to `.env`:
```env
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

---

## Troubleshooting

**Build fails?**
- Check all environment variables are set
- Run `npm run build` locally first
- Check for import errors

**Firebase errors?**
- Verify credentials match production project
- Check API key restrictions
- Ensure Firestore is enabled

**404 on refresh?**
- Ensure redirects configured (netlify.toml or vercel.json)
- All routes should redirect to `/index.html`

**CORS errors?**
- Add production domain to Firebase authorized domains
- Check API key HTTP referrer restrictions

---

## Related Docs

[SETUP.md](./SETUP.md) - Development setup
[FIRESTORE_INDEXES.md](./FIRESTORE_INDEXES.md) - Database indexes
[SECURITY.md](./SECURITY.md) - Security features
