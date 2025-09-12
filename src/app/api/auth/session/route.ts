// DO NOT add 'use server' here.
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import "@/lib/firebase-admin"; // singleton admin init

const SESSION_COOKIE = "__session";
const FLAG_COOKIE = "tcr_auth";

function isSecureReq() {
  const h = headers();
  const xfProto = h.get("x-forwarded-proto");
  return xfProto === "https" || process.env.NODE_ENV === "production";
}

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      return NextResponse.json({ error: "missing idToken" }, { status: 400 });
    }

    // Verify the token to ensure it’s valid for this project.
    const decoded = await getAuth().verifyIdToken(idToken, true);
    const maxAge = Math.min(60 * 60 * 24 * 5, (decoded.exp! - decoded.iat!)); // <= 5 days

    const c = cookies();
    const secure = isSecureReq();

    // HttpOnly token cookie for server verification
    c.set(SESSION_COOKIE, idToken, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge,
    });

    // Small non-HttpOnly flag so middleware can gate routes fast
    c.set(FLAG_COOKIE, "1", {
      sameSite: "lax",
      secure,
      path: "/",
      maxAge,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "invalid idToken" }, { status: 401 });
  }
}

export async function DELETE() {
  const c = cookies();
  c.delete(SESSION_COOKIE);
  c.delete(FLAG_COOKIE);
  return NextResponse.json({ ok: true });
}

// These are fine in a route file (no 'use server' present)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
