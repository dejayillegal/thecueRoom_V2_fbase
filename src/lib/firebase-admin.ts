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

function readServiceAccount() {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (!b64) {
    console.error("FIREBASE_SERVICE_ACCOUNT_B64 is missing. Falling back to default credentials.");
    return null;
  }
  try {
    const json = Buffer.from(b64, "base64").toString("utf8").trim();
    return JSON.parse(json);
  } catch (error) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_B64. Falling back to default credentials.", error);
    return null;
  }
}

export function getAdminApp(): App {
  if (app) {
    return app;
  }

  if (getApps().length > 0) {
    app = getApps()[0];
    return app!;
  }

  const serviceAccount = readServiceAccount();
  
  if (serviceAccount) {
    const projectId = process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id;
    app = initializeApp({
      credential: cert(serviceAccount),
      projectId,
    });
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
