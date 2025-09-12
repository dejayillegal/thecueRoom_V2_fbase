// ⚠️ Compat shim: prefer importing from '@/lib/auth-server' going forward.
// This file exists so old imports don't crash builds.
// DO NOT import this from client components.

if (typeof window !== "undefined") {
  throw new Error("Don't import '@/lib/auth' from client components. Use the Firebase client SDK.");
}
export * from "./auth-server";
