'use server';
import "server-only";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

// Type for decoded token custom claims. Avoid using `any` on claims.
interface Claims {
  admin?: boolean;
  [key: string]: unknown;
}

export async function requireUser() {
  const token = cookies().get("__session")?.value;
  if (!token) throw new Error("Unauthenticated");
  const auth = adminAuth();
  let decoded: any;
  try {
    decoded = await auth.verifySessionCookie(token, true);
  } catch {
    // Fall back to verifying the ID token.  This covers cases where the
    // session was stored as a raw ID token (e.g. createSessionCookie failed).
    decoded = await auth.verifyIdToken(token, true);
  }
  return { uid: decoded.uid, email: decoded.email, claims: decoded };
}

export async function requireAdmin() {
  const me = await requireUser();
  // Cast claims to a typed interface instead of using `any`.  This avoids
  // lint errors and allows safe property access.
  const claims = me.claims as unknown as Claims;
  if (!claims.admin) throw new Error("Forbidden");
  return me;
}
