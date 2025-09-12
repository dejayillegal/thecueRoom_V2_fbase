
// 'nodejs' runtime only — never import from client
import { getApps, initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app =
  getApps()[0] ??
  initializeApp({
    // Prefer a service account JSON in env (stringified). Fallback to ADC (Cloud/Studio).
    credential: process.env.FIREBASE_SERVICE_ACCOUNT
      ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
      : applicationDefault(),
  });

export const db = getFirestore(app);

// Critical: let Firestore drop undefined fields instead of crashing.
db.settings({ ignoreUndefinedProperties: true });
