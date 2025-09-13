
'use server';
import 'server-only';

import { cert, getApps, initializeApp, type App, type ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let appPromise: Promise<App> | null = null;
let dbSingleton: Firestore | null = null;

/**
 * Decode service account and ensure client & server use the SAME Firebase project.
 * Requires: FIREBASE_SERVICE_ACCOUNT_B64 (base64 of the full service account JSON)
 */
async function ensureApp(): Promise<App> {
  if (appPromise) return appPromise;
  appPromise = (async () => {
    if (getApps().length) return getApps()[0]!;
    const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
    if (!b64) {
      // Fallback for Workstations where env var might not be set, but default creds are.
      const existing = getApps()[0];
      if (existing) return existing;
      try {
        return initializeApp();
      } catch (e) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_B64 env is missing and Application Default Credentials failed.');
      }
    }
    const json = JSON.parse(Buffer.from(b64, 'base64').toString('utf8')) as ServiceAccount & {
      project_id: string;
    };
    // project alignment happens via credential + projectId (must match web config)
    return initializeApp({ credential: cert(json), projectId: json.project_id });
  })();
  return appPromise;
}

export async function adminAuth() {
  return getAuth(await ensureApp());
}

export async function adminDb(): Promise<Firestore> {
  if (dbSingleton) return dbSingleton;
  const db = getFirestore(await ensureApp());
  // configure ONCE
  db.settings({ ignoreUndefinedProperties: true });
  dbSingleton = db;
  return dbSingleton;
}

// Small helper to confirm wiring at /api/debug/firebase
export async function adminWhoami() {
  const app = await ensureApp();
  const projectId = app.options.projectId;
  const auth = await adminAuth();
  const apps = getApps().map(a => a.name);
  return { appName: app.name, projectId, authReady: !!auth, apps };
}

/** Back-compat exports (your debug route asked for these names) */
export async function adminApp(): Promise<App> {
  return ensureApp();
}
