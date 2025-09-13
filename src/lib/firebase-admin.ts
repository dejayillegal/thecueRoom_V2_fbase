import * as admin from 'firebase-admin';

type TcrAdminGlobal = { app?: admin.app.App; projectId?: string; saEmail?: string };
declare global { var __tcrAdmin__: TcrAdminGlobal | undefined }

function loadServiceAccount():
  | admin.Credential
  | null
{
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64?.trim();
  if (!b64) return null;
  const json = Buffer.from(b64, 'base64').toString('utf8');
  const obj = JSON.parse(json) as admin.ServiceAccount & { client_email?: string };
  if (!global.__tcrAdmin__) global.__tcrAdmin__ = {};
  global.__tcrAdmin__!.saEmail = obj.client_email;
  return admin.credential.cert(obj);
}

function resolveProjectId(): string | undefined {
  return (
    process.env.FIREBASE_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT
  );
}

function init(): admin.app.App {
  if (!global.__tcrAdmin__) global.__tcrAdmin__ = {};
  if (global.__tcrAdmin__!.app) return global.__tcrAdmin__!.app!;

  const credential = loadServiceAccount() || admin.credential.applicationDefault();
  const projectId = resolveProjectId();

  const app = admin.apps.length
    ? admin.app()
    : admin.initializeApp({ credential, projectId });

  global.__tcrAdmin__ = { app, projectId: projectId || app.options.projectId, saEmail: global.__tcrAdmin__!.saEmail };
  return app;
}

export async function adminApp(): Promise<admin.app.App> { return init(); }
export async function adminAuth(): Promise<admin.auth.Auth> { return admin.auth(await adminApp()); }
export async function adminDb(): Promise<admin.firestore.Firestore> { return admin.firestore(await adminApp()); }

// Optional tiny debug helper
export function adminWhoami() { return { projectId: global.__tcrAdmin__?.projectId, saEmail: global.__tcrAdmin__?.saEmail }; }
