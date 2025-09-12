/* No "use server" here! It's a shared server util, not a Server Action. */
import "server-only";
import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let app: App | null = null;

function getAdminApp(): App {
  if (app) return app;

  const serviceAccountB64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (serviceAccountB64) {
    const serviceAccount = JSON.parse(Buffer.from(serviceAccountB64, 'base64').toString('utf-8'));
    app = getApps()[0] ?? initializeApp({ credential: cert(serviceAccount) });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    app = getApps()[0] ?? initializeApp();
  } else {
    // Fallback for GCP/Firebase hosting runtimes or if GOOGLE_APPLICATION_CREDENTIALS is not set explicitly
    app = getApps()[0] ?? initializeApp();
  }
  
  return app!;
}

// Export plain **functions** (not Server Actions)
export function adminAuth() {
  return getAuth(getAdminApp());
}
export function adminDb() {
  const db = getFirestore(getAdminApp());
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}
