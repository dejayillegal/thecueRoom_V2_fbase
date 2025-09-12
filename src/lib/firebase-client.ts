
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
};

if (process.env.NODE_ENV !== "production") {
  // Helpful sanity print during dev (API key is safe to expose on web by design)
  // eslint-disable-next-line no-console
  console.log("[Firebase web config]", cfg);
}

const app = getApps()[0] ?? initializeApp(cfg);
export const auth = getAuth(app);
