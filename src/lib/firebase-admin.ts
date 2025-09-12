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
  // eslint-disable-next-line no-var
  var __tcrDbBroken: boolean | undefined;
}

// Allow forcing Firestore off (useful in Studio/Workstations)
function isDisabledByEnv() {
  const v =
    process.env.TCR_FIRESTORE_DISABLED ??
    process.env.FIRESTORE_DISABLED ??
    "";
  return ["1", "true", "yes"].includes(String(v).toLowerCase());
}

function initAdmin(): { app: App | null; db: Firestore | null } {
  if (isDisabledByEnv()) {
    globalThis.__tcrAdminApp = null;
    globalThis.__tcrDb = null;
    globalThis.__tcrDbInitError = null;
    return { app: null, db: null };
  }

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
        // settings() may have been called already — ignore
      }
      globalThis.__tcrDbConfigured = true;
    }

    globalThis.__tcrDbInitError = null;
    return { app, db };
  } catch (e: any) {
    globalThis.__tcrAdminApp = null;
    globalThis.__tcrDb = null;
    globalThis.__tcrDbInitError = e;
    return { app: null, db: null };
  }
}

const _inited = initAdmin();

export function getDb(): Firestore | null {
  if (isDisabledByEnv()) return null;
  if (globalThis.__tcrDbBroken) return null;
  return globalThis.__tcrDb ?? _inited.db ?? null;
}

export function isDbAvailable(): boolean {
  return !!getDb();
}

export function markDbBroken() {
  globalThis.__tcrDbBroken = true;
}

export function getDbInitError(): Error | null {
  return globalThis.__tcrDbInitError ?? null;
}
