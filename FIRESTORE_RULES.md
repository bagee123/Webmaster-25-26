# Firestore Security Rules Deployment

This project includes Firestore security rules to protect your data.

## Deploying Rules to Firebase

### Prerequisites
- Install Firebase CLI: `npm install -g firebase-tools`
- Authenticate: `firebase login`

### Deploy Rules
```bash
firebase deploy --only firestore:rules
```

### View Current Rules
```bash
firebase firestore:rules:list
```

## Rule Overview

- **Users**: Only authenticated users can access their own user documents
- **Resources**: Anyone can read; only authenticated users can submit
- **Blog Posts**: Anyone can read; only authenticated users can publish
- **Forum Topics**: Anyone can read; only authenticated users can create topics and replies
- **Comments**: Anyone can read; only authenticated users can comment
- **Validation**: All user-submitted data is validated on the server-side

## Important Notes

1. These rules should be deployed BEFORE going to production
2. Update the rules if you change data structures
3. Test rules in the Firebase Console before deploying to production
4. Monitor Firestore denied write requests in Firebase Analytics
