import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: "missing idToken" }, { status: 400 });
    }

    // This must match the same project as the client
    const decoded = await adminAuth().verifyIdToken(idToken, true);

    // Set HttpOnly session cookie (short TTL is fine; Firebase tokens refresh)
    const cookieStore = cookies();
    cookieStore.set("__session", idToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      // optional: 1 day
      maxAge: 60 * 60 * 24,
    });
    // lightweight flag for middleware
    cookieStore.set("tcr_auth", "1", {
      httpOnly: false,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({ ok: true, uid: decoded.uid });
  } catch (e: any) {
    // Surface project mismatch clearly during dev
    return NextResponse.json(
      { error: "invalid idToken", cause: e?.message },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete("__session");
  cookieStore.delete("tcr_auth");
  return NextResponse.json({ ok: true });
}
