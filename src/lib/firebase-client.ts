
import { initializeApp, getApps, FirebaseOptions, type FirebaseApp } from "firebase/app";

const config: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Singleton to ensure we only initialize app once.
let app: FirebaseApp | null = null;
let appPromise: Promise<FirebaseApp> | null = null;

export async function getFirebaseApp(): Promise<FirebaseApp> {
  if (app) return app;
  if (appPromise) return appPromise;

  appPromise = new Promise((resolve) => {
    if (getApps().length) {
      app = getApps()[0]!;
    } else {
      app = initializeApp(config);
    }
    resolve(app);

    // Dev-only logging to help debug config issues.
    if (process.env.NODE_ENV !== "production") {
      console.debug("[firebase-client] web config", {
        projectId: config.projectId,
        authDomain: config.authDomain,
        apiKeyTail: config.apiKey?.slice(-6),
        EMULATOR: process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST || null,
      });
    }
  });

  return appPromise;
}

// Note: Do not export `auth` directly to prevent eager loading.
// Instead, components should dynamically get the auth instance.
// For example:
// import { getAuth } from 'firebase/auth';
// import { getFirebaseApp } from '@/lib/firebase-client';
// const auth = getAuth(await getFirebaseApp());
