
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWGI_9AiJcGoI46E9t0pIMg8hcW1f9rkU",
  authDomain: "studio-4685889870-4fe96.firebaseapp.com",
  projectId: "studio-4685889870-4fe96",
  storageBucket: "studio-4685889870-4fe96.firebasestorage.app",
  messagingSenderId: "364717145672",
  appId: "1:364717145672:web:a9cc2a12de9d5a9176227d"
};


if (process.env.NODE_ENV !== "production") {
  // Helpful sanity print during dev (API key is safe to expose on web by design)
  // eslint-disable-next-line no-console
  console.log("[Firebase web config]", firebaseConfig);
}

const app = getApps()[0] ?? initializeApp(firebaseConfig);
export const auth = getAuth(app);
