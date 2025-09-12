// DO NOT add 'use server' here. This is a server-only lib.
import "server-only";
import admin from "firebase-admin";
import type { Firestore } from 'firebase-admin/firestore';

declare global {
  // eslint-disable-next-line no-var
  var __tcrAdminApp: admin.app.App | undefined;
  var __tcrDbBroken: boolean | undefined;
  var __tcrDb: unknown | null | undefined;
  var __tcrDbInitError: Error | null | undefined;
}

function init() {
  if (global.__tcrAdminApp) {
    return { app: global.__tcrAdminApp, db: globalThis.__tcrDb as Firestore | null };
  }

  if (globalThis.__tcrDbBroken) {
     return { app: undefined, db: null };
  }

  let app: admin.app.App | undefined;
  let db: Firestore | null = null;
  
  try {
    const hasInlineSA = !!process.env.FIREBASE_SERVICE_ACCOUNT;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    const credential = hasInlineSA
      ? admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!))
      : admin.credential.applicationDefault();

    if (!admin.apps.length) {
      admin.initializeApp({ credential, projectId });
    }
    
    app = admin.app();

    try {
      db = admin.firestore(app);
      globalThis.__tcrDb = db;
    } catch(e: any) {
      db = null;
      globalThis.__tcrDb = null;
      globalThis.__tcrDbBroken = true;
      globalThis.__tcrDbInitError = e;
    }
  } catch (e: any) {
    app = undefined;
    db = null;
    console.error("Firebase admin init failed", e);
  }

  global.__tcrAdminApp = app;
  return { app, db };
}

const _inited = init();

export const adminApp = _inited.app!;
export const adminAuth = _inited.app ? admin.auth(_inited.app) : null;

export async function getDb(): Promise<Firestore | null> {
  if (globalThis.__tcrDbBroken) return null;
  return globalThis.__tcrDb as Firestore ?? _inited.db;
}

export async function getDbInitError(): Promise<Error | null> {
  return globalThis.__tcrDbInitError ?? null;
}

export async function isDbAvailable(): Promise<boolean> {
  if (globalThis.__tcrDbBroken) return false;
  return !!(globalThis.__tcrDb ?? _inited.db);
}

export async function markDbBroken(): Promise<void> {
  globalThis.__tcrDbBroken = true;
  globalThis.__tcrDb = null;
}

export const ADMIN_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
