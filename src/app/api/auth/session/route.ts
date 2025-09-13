
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

type Ok = { ok: true; fallback?: boolean };
type Err = { error: string; cause?: string };

function json(data: Ok | Err, init?: number | ResponseInit) {
  return NextResponse.json(data, typeof init === "number" ? { status: init } : init);
}

export async function POST(req: Request) {
  try {
    // Read ONCE
    const ct = headers().get("content-type") ?? "";
    const raw = await req.text();
    let idToken = "";

    if (ct.includes("application/json")) {
      try {
        const parsed = JSON.parse(raw || "{}");
        idToken = (parsed?.idToken as string) || "";
      } catch {
        return json({ error: "invalid JSON" }, 400);
      }
    } else {
      idToken = raw.trim();
    }

    if (!idToken) {
      return json({ error: "missing idToken" }, 400);
    }

    // Create a session cookie (24h)
    const expiresIn = 24 * 60 * 60 * 1000;
    const auth = await adminAuth();
    const cookie = await auth.createSessionCookie(idToken, { expiresIn });

    const c = cookies();
    c.set({
      name: "__session",
      value: cookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000,
    });
    
    // Also set a client-readable flag
    c.set({
      name: "tcr_auth",
      value: "1",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000,
    });

    return json({ ok: true });
  } catch (e: unknown) {
    // Make failures explicit & debuggable (no 'INTERNAL' surprises)
    const msg = e instanceof Error ? e.message : String(e);
    // Common case: project mismatch -> 'Firebase ID token has incorrect "aud"...'
    return json({ error: "unexpected error in session route", cause: msg }, 500);
  }
}

export async function DELETE() {
  const c = cookies();
  c.set("__session", '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0, sameSite: 'lax' });
  c.set("tcr_auth", '', { httpOnly: false, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0, sameSite: 'lax' });
  return NextResponse.json({ ok: true });
}
