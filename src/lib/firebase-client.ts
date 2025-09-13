
// src/lib/firebase-client.ts
import { initializeApp, getApps, FirebaseOptions } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const config: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = getApps()[0] ?? initializeApp(config);
export const auth = getAuth(app);

// ---- DEV HELPERS (no-op in prod builds) ----------------
if (process.env.NODE_ENV !== "production") {
  // Log exactly what the client is using
  // (shows once on first import)
  // eslint-disable-next-line no-console
  console.debug("[firebase-client] web config", {
    projectId: config.projectId,
    authDomain: config.authDomain,
    apiKeyTail: config.apiKey?.slice(-6),
    EMULATOR: process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST || null,
  });
}

// If you *are* using emulator, set both client *and* server envs.
// Otherwise DO NOT set these at all.
if (process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST) {
  connectAuthEmulator(auth, `http://${process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST}`, { disableWarnings: true });
}
