
import "server-only";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Cookie names
const COOKIE_TOKEN = "__session";  // HttpOnly, server-verified
const COOKIE_FLAG  = "tcr_auth";   // readable by middleware

function cookieOpts(maxAgeSec: number) {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSec,
  };
}

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) return NextResponse.json({ error: "idToken required" }, { status: 400 });
    if (!adminAuth) return NextResponse.json({ error: "Auth service not available" }, { status: 500 });

    // Verify token with Admin SDK (checks signature + project)
    const decoded = await adminAuth.verifyIdToken(idToken, true);

    // Firebase ID tokens expire ~1 hour; pick a conservative cookie TTL
    const maxAgeSec = 55 * 60;

    const res = NextResponse.json({ ok: true, uid: decoded.uid, admin: !!(decoded as any).admin });

    // HttpOnly token cookie for server guards
    res.cookies.set(COOKIE_TOKEN, idToken, cookieOpts(maxAgeSec));

    // Non-HttpOnly presence cookie for middleware
    res.cookies.set(COOKIE_FLAG, "1", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: maxAgeSec,
    });

    return res;
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "verify failed" }, { status: 401 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  // Clear both cookies
  res.cookies.set("__session", "", { path: "/", maxAge: 0 });
  res.cookies.set("tcr_auth", "", { path: "/", maxAge: 0 });
  return res;
}
