
// IMPORTANT: Do NOT put "use server" in this file.
// This file is a plain Node helper module used by server routes.

import { cert, initializeApp, getApps, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let _app: App | null = null;
let _db: Firestore | null = null;
let _dbSettingsApplied = false;

function readServiceAccount(): Record<string, unknown> {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (!b64) throw new Error("FIREBASE_SERVICE_ACCOUNT_B64 is missing");
  // strip whitespace/newlines just in case
  const json = Buffer.from(b64.replace(/\s+/g, ""), "base64").toString("utf8").trim();
  try {
    return JSON.parse(json);
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_B64 is not valid JSON");
  }
}

export function getAdminApp(): App {
  if (_app) return _app;
  const sa = readServiceAccount();
  const projectId = process.env.FIREBASE_PROJECT_ID || (sa as any).project_id;
  if (!projectId) throw new Error("FIREBASE_PROJECT_ID is missing");
  _app = (getApps()[0] as App) ?? initializeApp({ credential: cert(sa as any), projectId });
  return _app;
}

export function adminAuth(): Auth {
  return getAuth(getAdminApp());
}

export function adminDb(): Firestore {
  if (_db) return _db;
  const db = getFirestore(getAdminApp());
  if (!_dbSettingsApplied) {
    db.settings({ ignoreUndefinedProperties: true }); // apply ONCE
    _dbSettingsApplied = true;
  }
  _db = db;
  return db;
}

/** Back-compat exports (your debug route asked for these names) */
export async function adminApp(): Promise<App> {
  return getAdminApp();
}

export async function adminWhoami(): Promise<{ projectId: string; apps: string[] }> {
  // don’t re-decode every time in hot paths in prod; ok for debug
  const sa = readServiceAccount();
  const projectId = process.env.FIREBASE_PROJECT_ID || (sa as any).project_id || "unknown";
  return { projectId, apps: getApps().map(a => a.name) };
}
