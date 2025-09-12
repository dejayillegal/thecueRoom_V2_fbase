import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth, adminProjectId } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) return NextResponse.json({ error: "missing idToken" }, { status: 400 });

    const decoded = await adminAuth().verifyIdToken(idToken, true);

    // Extra safety: aud must match our Admin project
    const expected = adminProjectId();
    if (decoded.aud !== expected) {
      return NextResponse.json(
        { error: "invalid idToken", cause: "audience mismatch", aud: decoded.aud, expected },
        { status: 401 }
      );
    }

    // Set session cookie (keep it separate from __session if you prefer)
    const cookieStore = cookies();
    cookieStore.set("__session", idToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    // light flag for middleware
    cookieStore.set("tcr_auth", "1", {
      httpOnly: false,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return new Response(null, { status: 204 });
  } catch (e: any) {
    return NextResponse.json({ error: "invalid idToken", cause: e?.message }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete("__session");
  cookieStore.delete("tcr_auth");
  return new Response(null, { status: 204 });
}
