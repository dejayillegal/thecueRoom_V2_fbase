
import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";
import "@/lib/firebase-admin"; // ensure admin app init (no Firestore needed)

export type AdminContext = { uid: string; email?: string; isAdmin: boolean };

export async function requireAdmin(): Promise<AdminContext> {
  const token = cookies().get("__session")?.value;
  if (!token) throw new Error("Unauthenticated");

  // Verify an ID token (not a session cookie)
  const decoded = await getAuth().verifyIdToken(token, true);
  const isAdmin = Boolean((decoded as any).admin); // your custom claim
  if (!isAdmin) throw new Error("Forbidden");

  return { uid: decoded.uid, email: decoded.email ?? undefined, isAdmin };
}
