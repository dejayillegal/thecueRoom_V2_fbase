
export const runtime = 'nodejs';

import { getDb } from "@/lib/firebase-admin"; // Ensures admin is initialized
import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) return new Response("Missing idToken", { status: 400 });

    const expiresIn = 5 * 24 * 60 * 60 * 1000; // 5 days
    const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn });

    const isProd = process.env.NODE_ENV === "production";
    const cookieStore = cookies();

    cookieStore.set("__session", sessionCookie, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000,
    });

    cookieStore.set("tcr_auth", "1", {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000,
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error("Session cookie creation failed:", error);
    return new Response("Authentication failed", { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.set("__session", "", { httpOnly: true, secure: false, sameSite: "lax", path: "/", maxAge: 0 });
  cookieStore.set("tcr_auth", "", { httpOnly: true, secure: false, sameSite: "lax", path: "/", maxAge: 0 });
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
  });
}
