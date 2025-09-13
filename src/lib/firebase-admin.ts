
'use server';
import "server-only";
import { cert, initializeApp, getApps, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let app: App | null = null;
let firestoreConfigured = false;

function readServiceAccount(): Record<string, unknown> {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (!b64) throw new Error("FIREBASE_SERVICE_ACCOUNT_B64 is missing");
  // normalize base64 (remove whitespace/newlines)
  const json = Buffer.from(b64.replace(/\s+/g, ""), "base64").toString("utf8");
  try {
    return JSON.parse(json);
  } catch (e) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_B64 is not valid JSON");
  }
}

export function getAdminApp(): App {
  if (app) return app;
  const sa = readServiceAccount();
  const projectId = process.env.FIREBASE_PROJECT_ID || (sa as any).project_id;
  if (!projectId) throw new Error("FIREBASE_PROJECT_ID is missing");
  app = (getApps()[0] as App) ?? initializeApp({ credential: cert(sa as any), projectId });
  return app;
}

export function adminAuth() {
  return getAuth(getAdminApp());
}

export function adminDb() {
  const db = getFirestore(getAdminApp());
  if (!firestoreConfigured) {
    db.settings({ ignoreUndefinedProperties: true });
    firestoreConfigured = true;
  }
  return db;
}
