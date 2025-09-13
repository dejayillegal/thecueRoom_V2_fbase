
/* No "use server" here! It's a shared server util, not a Server Action. */
import "server-only";
import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import process from "node:process";
import { Buffer } from "node:buffer";

// Cache the initialized app to avoid re-initializing on every request.
let app: App | null = null;
let firestoreConfigured = false;

function getAdminApp(): App {
  if (app) {
    return app;
  }

  if (getApps().length > 0) {
    app = getApps()[0];
    return app!;
  }

  const serviceAccountB64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (serviceAccountB64) {
    try {
      const decoded = Buffer.from(serviceAccountB64, "base64").toString("utf-8");
      const serviceAccount = JSON.parse(decoded);
      app = initializeApp({ credential: cert(serviceAccount) });
    } catch (err) {
      console.error("Failed to decode or parse FIREBASE_SERVICE_ACCOUNT_B64. Falling back to default credentials.", err);
      app = initializeApp();
    }
  } else {
    // Fallback for GCP/Firebase hosting runtimes where GOOGLE_APPLICATION_CREDENTIALS might be set.
    app = initializeApp();
  }
  
  return app!;
}

export function adminAuth() {
  return getAuth(getAdminApp());
}
export function adminDb() {
  const db = getFirestore(getAdminApp());
  if (!firestoreConfigured) {
    try {
      db.settings({ ignoreUndefinedProperties: true });
      firestoreConfigured = true;
    } catch (e) {
      // This might throw if settings are already partially applied or in a weird state.
      // We can safely ignore it in many cases, but let's log it.
      console.warn("Could not apply Firestore settings, may already be configured.", e);
      firestoreConfigured = true; // Mark as configured to avoid retrying.
    }
  }
  return db;
}
