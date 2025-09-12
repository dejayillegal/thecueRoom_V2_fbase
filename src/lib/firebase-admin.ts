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

const PROJECT_ID =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || // your Studio project id
  process.env.GOOGLE_CLOUD_PROJECT;              // last resort

// >>> Hard-pin the project id so verifyIdToken uses the right audience
if (PROJECT_ID) {
  process.env.GOOGLE_CLOUD_PROJECT = PROJECT_ID;
  process.env.GCLOUD_PROJECT = PROJECT_ID; // some libs read this alias
}

function init(): admin.app.App {
  if (global.__tcrAdminApp) return global.__tcrAdminApp;

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: PROJECT_ID, // CRITICAL
    });
  }
  global.__tcrAdminApp = admin.app();
  return global.__tcrAdminApp;
}

export const adminApp = init();
export function adminAuth() {
  return admin.auth(adminApp);
}

let _db: Firestore | null = null;
function tryInitDb() {
  if (_db) return _db;
  if (globalThis.__tcrDbBroken) return null;
  try {
    _db = admin.firestore(adminApp);
    return _db;
  } catch (e: any) {
    globalThis.__tcrDbInitError = e;
    globalThis.__tcrDbBroken = true;
    return null;
  }
}

export async function getDb(): Promise<Firestore | null> {
  return tryInitDb();
}

export async function getDbInitError(): Promise<Error | null> {
  return globalThis.__tcrDbInitError ?? null;
}

export async function isDbAvailable(): Promise<boolean> {
  return !!tryInitDb();
}

export async function markDbBroken(): Promise<void> {
  globalThis.__tcrDbBroken = true;
  globalThis.__tcrDb = null;
}

export const ADMIN_PROJECT_ID = PROJECT_ID; // optional: for debug
