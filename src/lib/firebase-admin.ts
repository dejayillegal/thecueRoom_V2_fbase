// 'nodejs' runtime only — never import from client
import type { App } from "firebase-admin/app";
import { getApps, initializeApp, applicationDefault, cert } from "firebase-admin/app";
import type { Firestore } from "firebase-admin/firestore";
import { getFirestore } from "firebase-admin/firestore";

declare global {
  // eslint-disable-next-line no-var
  var __tcrAdminApp: App | null | undefined;
  // eslint-disable-next-line no-var
  var __tcrDb: Firestore | null | undefined;
  // eslint-disable-next-line no-var
  var __tcrDbConfigured: boolean | undefined;
  // eslint-disable-next-line no-var
  var __tcrDbInitError: Error | null | undefined;
}

// Try to init Admin SDK; if it fails, remember the failure and run without Firestore.
function initAdmin(): { app: App | null; db: Firestore | null } {
  try {
    const app =
      globalThis.__tcrAdminApp ??
      (getApps()[0] ??
        initializeApp({
          credential: process.env.FIREBASE_SERVICE_ACCOUNT
            ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
            : applicationDefault(),
        }));
    globalThis.__tcrAdminApp = app;

    const db = globalThis.__tcrDb ?? getFirestore(app);
    globalThis.__tcrDb = db;

    if (!globalThis.__tcrDbConfigured) {
      try {
        db.settings({ ignoreUndefinedProperties: true });
      } catch {
        /* settings can only be called once; ignore repeat/late calls */
      }
      globalThis.__tcrDbConfigured = true;
    }
    globalThis.__tcrDbInitError = null;
    return { app, db };
  } catch (e: any) {
    globalThis.__tcrDbInitError = e;
    globalThis.__tcrAdminApp = null;
    globalThis.__tcrDb = null;
    return { app: null, db: null };
  }
}

const { db: _db } = initAdmin();

export function getDb(): Firestore | null {
  return globalThis.__tcrDb ?? _db ?? null;
}
export function isDbAvailable(): boolean {
  return !!getDb();
}
export function getDbInitError(): Error | null {
  return globalThis.__tcrDbInitError ?? null;
}
