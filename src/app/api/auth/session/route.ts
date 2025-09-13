
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const reqClone = req.clone(); // Clone request to read body multiple times if needed

  try {
    // Accept either JSON or plain text idToken body
    let idToken: string | null = null;
    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      try {
        const { idToken: token } = await req.json();
        idToken = token;
      } catch {
        // Fallback for malformed JSON
        idToken = null;
      }
    } else {
      idToken = (await req.text()).trim();
    }
    
    if (!idToken) {
      return NextResponse.json(
        { error: "missing idToken" },
        { status: 400 }
      );
    }

    // Attempt to create session cookie (5 days)
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth().createSessionCookie(idToken, { expiresIn });

    // Set cookie (httpOnly, secure in prod)
    const c = cookies();
    c.set({
      name: "__session",
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000,
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    // Fallback: verify the ID token directly to keep user logged in if session cookie creation fails
    try {
      let idTokenForFallback: string | null = null;
      const contentType = reqClone.headers.get("content-type") ?? "";
       if (contentType.includes("application/json")) {
         try {
           const { idToken: token } = await reqClone.json();
           idTokenForFallback = token;
         } catch {idTokenForFallback = null;}
      } else {
        idTokenForFallback = (await reqClone.text()).trim();
      }

      if (!idTokenForFallback) throw new Error("ID token unavailable for fallback.");

      const decoded = await adminAuth().verifyIdToken(idTokenForFallback);
      const c = cookies();
      c.set({
        name: "__session_idtoken",
        value: idTokenForFallback, // Store the full token for server-side verification
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60, // 1h fallback, matches ID token lifetime
      });
      return NextResponse.json({ ok: true, fallback: true });
    } catch (_e) {
      const errorMessage = _e instanceof Error ? _e.message : "verify failed";
      return NextResponse.json(
        { error: "invalid idToken", cause: (err as Error)?.message ?? errorMessage },
        { status: 401 }
      );
    }
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete('__session');
  cookieStore.delete('__session_idtoken');
  return NextResponse.json({ok: true});
}
