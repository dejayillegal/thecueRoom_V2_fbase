
'use server';
import "server-only";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import type { DecodedIdToken } from "firebase-admin/auth";

// Type for decoded token custom claims.
interface Claims {
  admin?: boolean;
  [key: string]: unknown;
}

// Combine DecodedIdToken with our custom Claims interface
type DecodedTokenWithClaims = DecodedIdToken & Claims;

export async function requireUser() {
  const token = cookies().get("__session")?.value;
  if (!token) throw new Error("Unauthenticated");
  const auth = adminAuth();
  let decoded: DecodedTokenWithClaims;
  try {
    decoded = await auth.verifySessionCookie(token, true) as DecodedTokenWithClaims;
  } catch {
    // Fall back to verifying the ID token. This covers cases where the
    // session was stored as a raw ID token (e.g. createSessionCookie failed).
    decoded = await auth.verifyIdToken(token, true) as DecodedTokenWithClaims;
  }
  return { uid: decoded.uid, email: decoded.email, claims: decoded };
}

export async function requireAdmin() {
  const me = await requireUser();
  if (!me.claims.admin) throw new Error("Forbidden");
  return me;
}
