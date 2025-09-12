'use server';
import "server-only";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

export async function requireUser() {
  const token = cookies().get("__session")?.value;
  if (!token) throw new Error("Unauthenticated");
  // Use verifySessionCookie instead of verifyIdToken
  const decoded = await adminAuth().verifySessionCookie(token, true);
  return { uid: decoded.uid, email: decoded.email, claims: decoded };
}

export async function requireAdmin() {
  const me = await requireUser();
  if (!(me.claims as any)?.admin) throw new Error("Forbidden");
  return me;
}
