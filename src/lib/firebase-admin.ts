
import { getApps, initializeApp, applicationDefault, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

type SA = { project_id: string; client_email: string; private_key: string };

function readSA(): SA | null {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64 || process.env.FIREBASE_SERVICE_ACCOUNT;
  if (b64) { try { return JSON.parse(Buffer.from(b64, "base64").toString("utf8")); } catch {} }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw) { try { return JSON.parse(raw); } catch {} }
  return null;
}

function clientProjectId() {
  return (
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID ||
    ""
  );
}

let _app: App | null = null;
let _db: ReturnType<typeof getFirestore> | null = null;

export function adminApp(): App {
  if (_app) return _app;

  const sa = readSA();
  const clientPid = clientProjectId();
  const adcPid = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;

  // If no SA and ADC points somewhere else, fail fast (prevents the "monospace-10" bug).
  if (!sa && adcPid && clientPid && adcPid !== clientPid) {
    throw new Error(
      `Firebase Admin ADC project (${adcPid}) != client project (${clientPid}). ` +
      `Set FIREBASE_SERVICE_ACCOUNT_B64 for project ${clientPid}.`
    );
  }

  if (getApps().length === 0) {
    _app = initializeApp(
        sa
        ? { credential: cert(sa), projectId: sa.project_id || clientPid }
        : { credential: applicationDefault(), projectId: clientPid }
    );
  } else {
    _app = getApps()[0];
  }


  try {
    _db = getFirestore(_app);
    _db.settings({ ignoreUndefinedProperties: true });
  } catch (e) {
    // This can throw if settings are already applied, which is fine.
  }

  return _app;
}

export const adminAuth = () => getAuth(adminApp());
export const adminDb = () => {
    if (!_db) {
        adminApp(); // ensures _db is initialized
    }
    return _db!;
}

// Small helper for debug/error messages
export const currentServerProjectId = () => adminApp().options.projectId as string | undefined;

let dbInitError: Error | null = null;
let dbBroken = false;

export async function getDb(): Promise<ReturnType<typeof getFirestore> | null> {
    if (dbBroken) return null;
    return adminDb();
}

export async function isDbAvailable(): Promise<boolean> {
    if (dbBroken) return false;
    try {
        await adminDb().listCollections();
        return true;
    } catch (e) {
        dbInitError = e as Error;
        dbBroken = true;
        return false;
    }
}

export async function markDbBroken(): Promise<void> {
    dbBroken = true;
}

export async function getDbInitError(): Promise<Error | null> {
    return dbInitError;
}
