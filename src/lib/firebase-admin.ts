
'use server';
import 'server-only';
import * as admin from 'firebase-admin';
import type { App } from 'firebase-admin/app';
import type { Firestore } from 'firebase-admin/firestore';
import { getFirestore } from 'firebase-admin/firestore';

declare global {
  // Avoid re-initting in dev/hot-reload
  var __tcrAdminApp: App | null | undefined;
  var __tcrDb: Firestore | null | undefined;
  var __tcrDbConfigured: boolean | undefined;
  var __tcrDbInitError: Error | null | undefined;
  var __tcrDbBroken: boolean | undefined;
}

function isDisabledByEnv() {
  const v = (process.env.TCR_FIRESTORE_DISABLED ?? process.env.FIRESTORE_DISABLED ?? "").toString().toLowerCase();
  return ["1", "true", "yes"].includes(v);
}

function initAdmin(): { app: App | null; db: Firestore | null } {
  if (globalThis.__tcrDbBroken || isDisabledByEnv()) {
    return { app: null, db: null };
  }
  
  if (globalThis.__tcrAdminApp && globalThis.__tcrDb) {
    return { app: globalThis.__tcrAdminApp, db: globalThis.__tcrDb };
  }

  try {
    const app =
      globalThis.__tcrAdminApp ??
      (admin.getApps()[0] ??
        admin.initializeApp({
          credential: process.env.FIREBASE_SERVICE_ACCOUNT
            ? admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
            : admin.credential.applicationDefault(),
          projectId: process.env.FIREBASE_PROJECT_ID,
        }));
    globalThis.__tcrAdminApp = app;
    
    const db = globalThis.__tcrDb ?? getFirestore(app);
    globalThis.__tcrDb = db;

    if (!globalThis.__tcrDbConfigured) {
      try { db.settings({ ignoreUndefinedProperties: true }); } catch {}
      globalThis.__tcrDbConfigured = true;
    }
    
    globalThis.__tcrDbInitError = null;
    return { app, db };
  } catch (e: any) {
    globalThis.__tcrAdminApp = null;
    globalThis.__tcrDb = null;
    globalThis.__tcrDbInitError = e;
    if (process.env.NODE_ENV !== 'production') {
      console.error("Firebase Admin init failed:", e.message);
    }
    return { app: null, db: null };
  }
}

const _inited = initAdmin();

export const adminApp = _inited.app;
export const adminAuth = _inited.app ? admin.auth(_inited.app) : null;

export async function getDb(): Promise<Firestore | null> {
  if (globalThis.__tcrDbBroken) return null;
  return globalThis.__tcrDb ?? _inited.db;
}

export async function getDbInitError(): Promise<Error | null> {
  return globalThis.__tcrDbInitError ?? null;
}

export async function isDbAvailable(): Promise<boolean> {
  return !!(await getDb());
}

export async function markDbBroken(): Promise<void> {
  globalThis.__tcrDbBroken = true;
  globalThis.__tcrDb = null;
}
