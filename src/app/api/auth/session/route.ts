import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {adminAuth} from '@/lib/firebase-admin';

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
      // Attempt to create a long-lived session cookie using the Admin SDK.  Not all
      // service accounts are authorized for this operation (it requires the
      // identitytoolkit.sessions.create permission).  If it fails, we'll fall back
      // to using the raw ID token as the session value.
      const expiresInMs = 60 * 60 * 24 * 5 * 1000; // 5 days
      sessionValue = await auth.createSessionCookie(idToken, { expiresIn: expiresInMs });
      decoded = await auth.verifySessionCookie(sessionValue, true);
    } catch (err) {
      // Fall back to verifying the ID token directly.  This still returns the
      // decoded claims and we use the ID token as our session value.  The
      // cookie's TTL is set to match the token's expiry (1 hour).
      decoded = await auth.verifyIdToken(idToken, true);
      sessionValue = idToken;
    }
    const cookieStore = cookies();
    const isProd = process.env.NODE_ENV === "production";
    // Determine expiration: if using a session cookie, it lasts 5 days; if using
    // the ID token, expire in 1 hour to align with Firebase ID token TTL.
    const maxAgeSeconds = sessionValue === idToken ? 60 * 60 : (60 * 60 * 24 * 5);
    cookieStore.set("__session", sessionValue, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: maxAgeSeconds,
    });
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
