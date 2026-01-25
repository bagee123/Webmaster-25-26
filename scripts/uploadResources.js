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
  console.error('📝 Download it from Firebase Console → Project Settings → Service Accounts');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadResources() {
  try {
    // Import resources dynamically
    const resources = (await import('../src/data/resources.js')).default;
    
    console.log(`🔄 Starting upload of ${resources.length} resources...`);
    
    const batch = db.batch();
    let count = 0;
    
    for (const resource of resources) {
      const docRef = db.collection('resources').doc(String(resource.id));
      batch.set(docRef, {
        ...resource,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      count++;
    }
    
    await batch.commit();
    console.log(`✅ Successfully uploaded ${count} resources to Firestore!`);
    console.log('📦 All resources are now live in your Firestore database');
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

uploadResources();
