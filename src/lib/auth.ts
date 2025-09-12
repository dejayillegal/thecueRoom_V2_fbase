
import { cookies, headers } from "next/headers";
import { getAuth } from "firebase-admin/auth";
import { getDb } from "@/lib/firebase-admin";

export type AdminContext = { uid: string; email?: string; isAdmin: boolean };

export async function requireAdmin(): Promise<AdminContext> {
  const db = getDb(); // Initializes admin if not already
  const cookie = cookies().get("__session")?.value || "";
  
  if (!cookie) {
    const authHeader = headers().get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const idToken = authHeader.split("Bearer ")[1];
      const decodedToken = await getAuth().verifyIdToken(idToken);
      const isAdmin = Boolean((decodedToken as any).admin);
      if (!isAdmin) throw new Error("Forbidden: Admin privileges required.");
      return { uid: decodedToken.uid, email: decodedToken.email, isAdmin };
    }
    throw new Error("Unauthenticated");
  }

  try {
    const token = await getAuth().verifySessionCookie(cookie, true);
    const isAdmin = Boolean((token as any).admin);
    if (!isAdmin) throw new Error("Forbidden: Admin privileges required.");
    
    return { uid: token.uid, email: token.email ?? undefined, isAdmin };
  } catch (error) {
    console.error("Session cookie verification failed:", error);
    throw new Error("Authentication session is invalid or expired. Please sign in again.");
  }
}
