
import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";

export type AdminContext = { uid: string; email?: string; isAdmin: boolean };

export async function requireAdmin(): Promise<AdminContext> {
  const session = cookies().get("__session")?.value;
  if (!session) throw new Error("Unauthenticated");

  const decoded = await getAuth().verifySessionCookie(session, true);
  const isAdmin = Boolean((decoded as any).admin); // set via custom claims
  if (!isAdmin) throw new Error("Forbidden");

  return { uid: decoded.uid, email: decoded.email ?? undefined, isAdmin };
}
