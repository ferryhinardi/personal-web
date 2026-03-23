import {initializeApp, getApps, getApp} from 'firebase/app';
import {getFirestore, connectFirestoreEmulator} from 'firebase/firestore';

/**
 * Firebase configuration from environment variables.
 * All values are public (client-side safe).
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

/**
 * Check if Firebase is configured (environment variables are set).
 * When not configured, Firebase features gracefully degrade to no-ops.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
);

/**
 * Initialize Firebase app (singleton — safe to call multiple times).
 */
const app = isFirebaseConfigured
  ? getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp()
  : null;

/**
 * Firestore database instance.
 * Returns null if Firebase is not configured.
 */
export const db = app ? getFirestore(app) : null;

/**
 * Connect to Firestore emulator in development.
 */
if (
  import.meta.env.DEV &&
  import.meta.env.VITE_FIREBASE_USE_EMULATOR === 'true' &&
  db
) {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export {app};
