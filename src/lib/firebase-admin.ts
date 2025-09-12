
/* No "use server" here! It's a shared server util, not a Server Action. */
import "server-only";
import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let app: App | null = null;

function getAdminApp(): App {
  if (app) return app;

  const serviceAccountB64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
   // Updated logic: gracefully handle invalid base64 or malformed JSON in the
   // FIREBASE_SERVICE_ACCOUNT_B64 environment variable.  If decoding or
   // parsing fails, we log the error and fall back to using default
   // credentials or the GOOGLE_APPLICATION_CREDENTIALS environment.  This
   // prevents unhandled exceptions like "Bad control character in string
   // literal" from crashing the server during initialization.
   if (serviceAccountB64) {
     try {
       const decoded = Buffer.from(serviceAccountB64, "base64").toString("utf-8");
       const serviceAccount = JSON.parse(decoded);
       app = getApps()[0] ?? initializeApp({ credential: cert(serviceAccount) });
     } catch (err) {
       console.error("Failed to decode or parse FIREBASE_SERVICE_ACCOUNT_B64:", err);
       // Fall back to GOOGLE_APPLICATION_CREDENTIALS if available
       if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
         app = getApps()[0] ?? initializeApp();
       } else {
         // As a last resort, initialize without explicit credentials.  This
         // works when running in Google Cloud environments where default
         // credentials are available.
         app = getApps()[0] ?? initializeApp();
       }
     }
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
