/* No "use server" here! It's a shared server util, not a Server Action. */
import "server-only";
import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import process from "node:process";
import { Buffer } from "node:buffer";

let app: App | null = null;

function getAdminApp(): App {
  if (app) return app;

  const serviceAccountB64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (serviceAccountB64) {
    try {
      const decoded = Buffer.from(serviceAccountB64, "base64").toString("utf-8");
      const serviceAccount = JSON.parse(decoded);
      app = getApps()[0] ?? initializeApp({ credential: cert(serviceAccount) });
    } catch (err) {
      console.error("Failed to decode or parse FIREBASE_SERVICE_ACCOUNT_B64:", err);
      // Fall back to GOOGLE_APPLICATION_CREDENTIALS if available
      app = getApps()[0] ?? initializeApp();
    }
  } else {
    // Fallback for GCP/Firebase hosting runtimes or if GOOGLE_APPLICATION_CREDENTIALS is set
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
