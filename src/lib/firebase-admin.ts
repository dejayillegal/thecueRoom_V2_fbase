// src/lib/firebase-admin.ts
import "server-only";
import { getApps, initializeApp, applicationDefault, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

type SA = { project_id: string; client_email: string; private_key: string };

function readServiceAccount(): SA | null {
  // Prefer a base64-encoded SA (safe for .env)
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64 || process.env.FIREBASE_SERVICE_ACCOUNT;
  if (b64) {
    try { return JSON.parse(Buffer.from(b64, "base64").toString("utf8")); } catch {}
  }
  // Or raw JSON if you really must
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw) { try { return JSON.parse(raw); } catch {} }
  return null;
}

// Figure out the correct project id, always matching the client app
function resolveProjectId(sa?: SA | null) {
  return (
    sa?.project_id ||
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || // <- keep client+server in lockstep
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT
  );
}

let _app: App | null = null;
let _db: ReturnType<typeof getFirestore> | null = null;

export function adminApp(): App {
  if (_app) return _app;
  const sa = readServiceAccount();
  const projectId = resolveProjectId(sa);

  const apps = getApps();
  if (apps.length > 0) {
    _app = apps[0];
  } else {
    _app = initializeApp({
      credential: sa ? cert(sa) : applicationDefault(),
      projectId, // <- critical to avoid token "aud" mismatch
    });
  }

  // Firestore safety
  const db = getFirestore(_app);
  try {
    db.settings({ ignoreUndefinedProperties: true });
  } catch (e) {
    // This can throw if settings are already applied, which is fine.
  }
  _db = db;
  return _app;
}

export const adminAuth = () => getAuth(adminApp());
export const adminDb = () => {
    if (_db) return _db;
    adminApp(); // ensures _db is initialized
    return _db!;
};

// Small helper for debug/error messages
export const currentServerProjectId = () => adminApp().options.projectId as string | undefined;

export async function getDb(): Promise<ReturnType<typeof getFirestore> | null> {
    return adminDb();
}

export async function isDbAvailable(): Promise<boolean> {
    try {
        await adminDb().listCollections();
        return true;
    } catch {
        return false;
    }
}

export async function markDbBroken(): Promise<void> {
    // This is now a no-op as we initialize on-demand, but kept for compatibility.
}

export async function getDbInitError(): Promise<Error | null> {
    return null; // Initialization errors would throw directly now.
}
