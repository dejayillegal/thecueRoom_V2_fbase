
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  // Accept both JSON and raw text idToken bodies
  const ct = req.headers.get("content-type") ?? "";
  let idToken = "";
  try {
    idToken = ct.includes("application/json")
      ? (await req.json()).idToken
      : (await req.text()).trim();
  } catch {
    /* ignore parse errors */
  }
  if (!idToken) {
    return NextResponse.json({ error: "missing idToken" }, { status: 400 });
  }

  try {
    // Primary: create a session cookie (24h)
    const expiresIn = 24 * 60 * 60 * 1000;
    const sessionCookie = await adminAuth().createSessionCookie(idToken, { expiresIn });

    cookies().set({
      name: "__session",
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // If this throws "invalid idToken" it means client/server projects don't match.
    // Keep this response explicit for debugging.
    return NextResponse.json(
      { error: "invalid idToken", cause: (err as Error).message },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete('__session');
  cookieStore.delete('__session_idtoken');
  return NextResponse.json({ok: true});
}
