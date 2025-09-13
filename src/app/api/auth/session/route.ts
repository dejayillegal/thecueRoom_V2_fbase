
import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {adminAuth} from '@/lib/firebase-admin';
import process from "node:process";

export async function POST(req: Request) {
  try {
    // Parse the request body manually to handle malformed JSON gracefully.
    const bodyText = await req.text();
    let parsed: any = {};
    try {
      parsed = JSON.parse(bodyText);
    } catch {
      return NextResponse.json({ error: "invalid_request", cause: "Malformed JSON payload" }, { status: 400 });
    }
    const { idToken } = parsed;

    if (!idToken) {
      return NextResponse.json({ error: "missing idToken" }, { status: 400 });
    }

    const auth = adminAuth();
    let sessionValue: string;
    let decoded: any;
    try {
      // Attempt to create a long-lived session cookie using the Admin SDK.
      // This requires the identitytoolkit.sessions.create permission.
      const expiresInMs = 60 * 60 * 24 * 5 * 1000; // 5 days
      sessionValue = await auth.createSessionCookie(idToken, { expiresIn: expiresInMs });
      decoded = await auth.verifySessionCookie(sessionValue, true);
    } catch (err) {
      // If session cookie creation fails, fall back to using the raw ID token.
      // The cookie's TTL will match the token's expiry (1 hour).
      console.warn("Session cookie creation failed, falling back to ID token.", err);
      decoded = await auth.verifyIdToken(idToken, true);
      sessionValue = idToken;
    }
    
    const cookieStore = cookies();
    const isProd = process.env.NODE_ENV === "production";
    // Determine expiration: 5 days for session cookie, 1 hour for ID token.
    const maxAgeSeconds = sessionValue === idToken ? 60 * 60 : (60 * 60 * 24 * 5);

    cookieStore.set("__session", sessionValue, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: maxAgeSeconds,
    });

    // Set a client-side readable flag to help middleware.
    cookieStore.set("tcr_auth", "1", {
      httpOnly: false,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: maxAgeSeconds,
    });

    return NextResponse.json({ ok: true, uid: decoded.uid });
  } catch (e: any) {
    return NextResponse.json(
      { error: "invalid idToken", cause: e?.message ?? String(e) },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete('__session');
  cookieStore.delete('tcr_auth');
  return NextResponse.json({ok: true});
}
