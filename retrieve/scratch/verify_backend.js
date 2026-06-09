const path = require('path');
const fs = require('fs');

// Load environment variables manually
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx > 0) {
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim();
      process.env[key] = val;
    }
  }
  console.log('Loaded env variables manually');
} else {
  console.error('.env.local not found');
  process.exit(1);
}

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc, deleteDoc } = require('firebase/firestore');
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

async function runTests() {
  console.log('\n--- STARTING INTEGRATION TESTS ---');

  // 1. Test Firebase Storage First
  try {
    console.log('\n[Storage Test] Preparing mock file...');
    const fileContent = 'Verify Storage connectivity: ' + Date.now();
    const buffer = Buffer.from(fileContent, 'utf-8');

    console.log('[Storage Test] Uploading file...');
    const testFileRef = ref(storage, 'system_tests/connection_test.txt');
    await uploadBytes(testFileRef, buffer, { contentType: 'text/plain' });
    console.log('✅ Storage Upload: Successful.');

    console.log('[Storage Test] Fetching download URL...');
    const downloadUrl = await getDownloadURL(testFileRef);
    console.log('✅ Storage Download URL:', downloadUrl);

    console.log('[Storage Test] Cleaning up test file...');
    await deleteObject(testFileRef);
    console.log('✅ Storage Cleaned: Successful.');
  } catch (err) {
    console.error('❌ Storage Test Failed:', err.message);
  }

  // 2. Test Firestore Second
  try {
    console.log('\n[Firestore Test] Writing test document...');
    const testDocRef = doc(db, 'system_tests', 'integration_check');
    await setDoc(testDocRef, {
      status: 'active',
      timestamp: new Date().toISOString()
    });
    console.log('✅ Firestore Write: Successful.');

    console.log('[Firestore Test] Reading document...');
    const snap = await getDoc(testDocRef);
    if (snap.exists()) {
      console.log('✅ Firestore Read: Successful. Data:', snap.data());
      await deleteDoc(testDocRef);
      console.log('✅ Firestore Cleaned: Successful.');
    } else {
      throw new Error('Document not found after write');
    }
  } catch (err) {
    console.error('❌ Firestore Test Failed:', err.message);
  }

  console.log('\n--- TESTS COMPLETED ---');
}

runTests().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('Test runner execution failed:', err);
  process.exit(1);
});
