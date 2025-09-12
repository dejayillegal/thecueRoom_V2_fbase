import "server-only";
import admin from "firebase-admin";

declare global {
  // Next.js dev: keep a single Admin app
  // eslint-disable-next-line no-var
  var __tcr_admin: admin.app.App | undefined;
  // eslint-disable-next-line no-var
  var __tcr_admin_project: string | undefined;
}

function readServiceAccount(): admin.ServiceAccount | null {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (b64) {
    try {
      return JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
    } catch {}
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {}
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
      ? admin.initializeApp({
          credential: admin.credential.cert(sa as any),
          projectId,
        })
      : admin.initializeApp({
          credential: admin.credential.applicationDefault(),
          // crucial: pin projectId so ADC can't point at a different project
          projectId,
        });
    global.__tcr_admin_project = projectId;
  }
  return global.__tcr_admin!;
}

export const adminAuth = () => admin.auth(adminApp());
export const adminDb = () => admin.firestore(adminApp());
export const adminProjectId = () =>
  global.__tcr_admin_project ||
  process.env.FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  "";
