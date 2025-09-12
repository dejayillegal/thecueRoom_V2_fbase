
'use server';

import "server-only";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

export type AdminContext = { uid: string; email?: string; isAdmin: boolean };

export async function requireUser(): Promise<{ uid: string; email?: string; claims: any }> {
  const token = cookies().get("__session")?.value;
  if (!token) throw new Error("Unauthenticated");
  const decoded = await adminAuth().verifyIdToken(token, true);
  return { uid: decoded.uid, email: decoded.email ?? undefined, claims: decoded };
}

export async function requireAdmin(): Promise<AdminContext> {
  const { uid, email, claims } = await requireUser();
  const isAdmin = Boolean((claims as any).admin);
  if (!isAdmin) throw new Error("Forbidden");
  return { uid, email, isAdmin };
}
