// DO NOT add 'use server' here.
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import "@/lib/firebase-admin"; // singleton admin init
import { ADMIN_PROJECT_ID } from "@/lib/firebase-admin";

const SESSION_COOKIE = "__session";
const FLAG_COOKIE = "tcr_auth";

function isSecureReq() {
  const h = headers();
  const xfProto = h.get("x-forwarded-proto");
  return xfProto === "https" || process.env.NODE_ENV === "production";
}

export async function POST(req: Request) {
  let idToken: string | undefined;
  try {
    const body = await req.json();
    idToken = body?.idToken;
    if (!idToken) {
      return NextResponse.json({ error: "missing idToken" }, { status: 400 });
    }

    const decoded = await getAuth().verifyIdToken(idToken, true);

    const maxAge = Math.min(60 * 60 * 24 * 5, decoded.exp! - decoded.iat!);
    const c = cookies();
    const secure = isSecureReq();

    c.set(SESSION_COOKIE, idToken, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge,
    });
    c.set(FLAG_COOKIE, "1", { sameSite: "lax", secure, path: "/", maxAge });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    // Decode without verifying to show helpful hints
    let aud: string | undefined;
    let iss: string | undefined;
    try {
      const [, payload] = (idToken || "").split(".");
      const json =
        payload && JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
      aud = json?.aud;
      iss = json?.iss;
    } catch {}

    return NextResponse.json(
      {
        error: "invalid idToken",
        cause: e?.message,
        aud,
        iss,
        expectedProjectId: ADMIN_PROJECT_ID,
      },
      { status: 401 }
    );
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
