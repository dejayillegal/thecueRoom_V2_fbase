// DO NOT add "use server" here; this is a shared server utility.
// It must NOT be treated as a Server Action module.

import { cert, getApps, initializeApp, type App, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let _app: App | null = null;
let _db: Firestore | null = null;
let _settingsApplied = false;

function readServiceAccount(): Record<string, unknown> | null {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (!b64) return null;
  try {
    const json = Buffer.from(b64, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getAdminApp(): App {
  if (_app) return _app;

  const existing = getApps()[0];
  if (existing) {
    _app = existing;
    return _app;
  }

  const svc = readServiceAccount();
  _app = initializeApp(
    svc
      ? { credential: cert(svc as any) }
      : { credential: applicationDefault() } // fallback for Workstations
  );

  return _app;
}

export function adminAuth() {
  return getAuth(getAdminApp());
}

// Not a Server Action — just a function returning a singleton.
export function adminDb(): Firestore {
  if (_db) return _db;

  _db = getFirestore(getAdminApp());
  if (!_settingsApplied) {
    // apply once; avoids "Firestore has already been initialized / settings()" spam
    _db.settings({ ignoreUndefinedProperties: true });
    _settingslied = true;
  }
  return _db;
}

// Small helper to confirm wiring at /api/debug/firebase
export async function adminWhoami() {
  const app = getAdminApp();
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT;
  const auth = adminAuth();
  return { appName: app.name, projectId, authReady: !!auth };
}

/** Back-compat exports (your debug route asked for these names) */
export function adminApp(): App {
  return getAdminApp();
}