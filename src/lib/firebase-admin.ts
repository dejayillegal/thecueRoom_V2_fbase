import "server-only";
import admin from "firebase-admin";

declare global {
  // keep a single Admin app/db in dev
  // eslint-disable-next-line no-var
  var __tcr_admin: admin.app.App | undefined;
  // eslint-disable-next-line no-var
  var __tcr_admin_project: string | undefined;
  // eslint-disable-next-line no-var
  var __tcrDb: FirebaseFirestore.Firestore | null | undefined;
  // eslint-disable-next-line no-var
  var __tcrDbBroken: boolean | undefined;
}

function readServiceAccount(): admin.ServiceAccount | null {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (b64) {
    try { return JSON.parse(Buffer.from(b64, "base64").toString("utf8")); } catch {}
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (raw) {
    try { return JSON.parse(raw); } catch {}
  }
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (clientEmail && privateKey && projectId) {
    return { clientEmail, privateKey, projectId } as any;
  }
  return null;
}

export function adminApp(): admin.app.App {
  if (global.__tcr_admin) return global.__tcr_admin;

  const sa = readServiceAccount();
  const projectId =
    sa?.projectId ||
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!admin.apps.length) {
    global.__tcr_admin = sa
      ? admin.initializeApp({ credential: admin.credential.cert(sa as any), projectId })
      : admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId });
    global.__tcr_admin_project = projectId;
  }
  return global.__tcr_admin!;
}

export const adminAuth = () => admin.auth(adminApp());

export function adminDb(): FirebaseFirestore.Firestore {
  if (global.__tcrDb) return global.__tcrDb!;
  global.__tcrDb = admin.firestore(adminApp());
  return global.__tcrDb!;
}

export const adminProjectId = () =>
  global.__tcr_admin_project ||
  process.env.FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  "";

/* ──────────────────────────────────────────────────────────────
   Backwards-compat exports used by existing code
   (Fixes: "Export getDb doesn't exist in target module")
   These are thin wrappers around the singletons above.
   No 'use server' directive here, so sync exports are fine.
─────────────────────────────────────────────────────────────── */

export function getDb(): FirebaseFirestore.Firestore {
  // If a previous fatal marked the DB as broken, keep throwing
  if (global.__tcrDbBroken) {
    throw new Error("Firestore marked broken for this process");
  }
  try {
    return adminDb();
  } catch (e) {
    global.__tcrDbBroken = true;
    global.__tcrDb = null;
    throw e;
  }
}

export function isDbAvailable(): boolean {
  return global.__tcrDbBroken !== true;
}

export function markDbBroken(): void {
  global.__tcrDbBroken = true;
  global.__tcrDb = null;
}
