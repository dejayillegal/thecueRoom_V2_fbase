// DO NOT add 'use server' here. This is a server-only lib.
import "server-only";
import admin from "firebase-admin";
import type { Firestore } from 'firebase-admin/firestore';

declare global {
  // eslint-disable-next-line no-var
  var __tcrAdminApp: admin.app.App | undefined;
}

function init(): admin.app.App {
  if (global.__tcrAdminApp) return global.__tcrAdminApp;

  if (!admin.apps.length) {
    admin.initializeApp({
      // In Firebase Hosting / Cloud env the default credentials work.
      // For local dev with a service account, set GOOGLE_APPLICATION_CREDENTIALS.
      credential: admin.credential.applicationDefault(),
    });
  }
  global.__tcrAdminApp = admin.app();
  return global.__tcrAdminApp;
}

export const adminApp = init();
export function adminAuth() {
  return admin.auth(adminApp);
}
export async function getDb(): Promise<Firestore | null> {
  try {
    return admin.firestore(adminApp);
  } catch {
    return null as any;
  }
}

// Keep db-related helpers for news feed feature
export async function getDbInitError(): Promise<Error | null> { return null; }
export async function isDbAvailable(): Promise<boolean> { return !!(await getDb()); }
export async function markDbBroken(): Promise<void> { /* no-op, handled by getDb */ }
