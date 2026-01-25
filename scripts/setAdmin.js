import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load service account key
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ serviceAccountKey.json not found in project root');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const userEmail = process.argv[2];

if (!userEmail) {
  console.error('Usage: node scripts/setAdmin.js user@example.com');
  process.exit(1);
}

try {
  const user = await admin.auth().getUserByEmail(userEmail);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  console.log(`✅ ${userEmail} is now an admin`);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} finally {
  process.exit(0);
}
