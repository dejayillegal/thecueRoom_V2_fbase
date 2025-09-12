import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {adminAuth} from '@/lib/firebase-admin';

export async function POST(req: Request) {
  const cookieStore = cookies();
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

    // Create a long-lived Firebase session cookie.  This both verifies the ID
    // token and exchanges it for a session cookie that can last days instead
    // of one hour.  The session cookie is then stored in the "__session"
    // cookie (HTTP-only) and a lightweight "tcr_auth" flag is set for the
    // middleware to check.
    const auth = adminAuth();
    const expiresInMs = 60 * 60 * 24 * 5 * 1000; // 5 days in ms
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: expiresInMs });
    const decoded = await auth.verifySessionCookie(sessionCookie, true);

    cookieStore.set("__session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresInMs / 1000,
    });
    cookieStore.set("tcr_auth", "1", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresInMs / 1000,
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
