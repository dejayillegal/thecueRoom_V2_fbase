import { NextRequest, NextResponse } from "next/server";
import { adminAuth, currentServerProjectId } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const SESSION_COOKIE = "__session";        // HttpOnly; used by server guards
const FLAG_COOKIE = "tcr_auth";            // Non-HttpOnly; for middleware redirects
const ONE_WEEK = 60 * 60 * 24 * 7;

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      return NextResponse.json({ error: "invalid idToken (missing)" }, { status: 400 });
    }

    // Verify token against the Admin app's project
    const decoded = await adminAuth().verifyIdToken(idToken, true);

    const res = NextResponse.json({ ok: true, uid: decoded.uid });
    res.cookies.set(SESSION_COOKIE, idToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: ONE_WEEK,
    });
    // middleware uses this lightweight flag (no secrets)
    res.cookies.set(FLAG_COOKIE, "1", {
      httpOnly: false,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: ONE_WEEK,
    });
    return res;
  } catch (e: any) {
    return NextResponse.json(
      {
        error: "invalid idToken",
        cause: e?.message,
        expectedProjectId: currentServerProjectId(),
      },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { path: "/", httpOnly: true, expires: new Date(0) });
  res.cookies.set(FLAG_COOKIE, "", { path: "/", expires: new Date(0) });
  return res;
}
