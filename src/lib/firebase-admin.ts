// 'nodejs' runtime only — never import from client
import type { App } from "firebase-admin/app";
import { getApps, initializeApp, applicationDefault, cert } from "firebase-admin/app";
import type { Firestore } from "firebase-admin/firestore";
import { getFirestore } from "firebase-admin/firestore";

declare global {
  // eslint-disable-next-line no-var
  var __tcrAdminApp: App | undefined;
  // eslint-disable-next-line no-var
  var __tcrDb: Firestore | undefined;
  // eslint-disable-next-line no-var
  var __tcrDbConfigured: boolean | undefined;
}

const app =
  globalThis.__tcrAdminApp ??
  (() => {
    const a =
      getApps()[0] ??
      initializeApp({
        credential: process.env.FIREBASE_SERVICE_ACCOUNT
          ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
          : applicationDefault(),
      });
    globalThis.__tcrAdminApp = a;
    return a;
  })();

const db =
  globalThis.__tcrDb ??
  (() => {
    const d = getFirestore(app);
    globalThis.__tcrDb = d;
    return d;
  })();

// Try to set once; ignore if already set/used elsewhere.
if (!globalThis.__tcrDbConfigured) {
  try {
    db.settings({ ignoreUndefinedProperties: true });
  } catch {
    // If settings() was already called or Firestore was used, ignore.
  }
  globalThis.__tcrDbConfigured = true;
}

export { db };
