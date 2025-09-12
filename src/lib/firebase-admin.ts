
'use server';
// 'nodejs' runtime only — never import from client
import "server-only";
import * as admin from "firebase-admin";

declare global {
  // Avoid re-initting in dev/hot-reload
  // eslint-disable-next-line no-var
  var __tcr_admin_app__: admin.app.App | undefined;
}

function init() {
  if (global.__tcr_admin_app__) return global.__tcr_admin_app__;

  const hasInlineSA = !!process.env.FIREBASE_SERVICE_ACCOUNT;
  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    (hasInlineSA ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!).project_id : undefined);

  const credential = hasInlineSA
    ? admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!))
    : admin.credential.applicationDefault();

  global.__tcr_admin_app__ = admin.initializeApp({ credential, projectId });
  return global.__tcr_admin_app__;
}

export const adminApp = init();
export const adminAuth = () => admin.auth(adminApp);
