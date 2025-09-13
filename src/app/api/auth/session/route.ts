
import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {adminAuth} from '@/lib/firebase-admin';
import process from "node:process";

export async function POST(req: Request) {
  const t0 = performance.now();
  try {
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
    let isSessionCookie = false;
    
    const t1 = performance.now();

    try {
      const expiresInMs = 60 * 60 * 24 * 5 * 1000; // 5 days
      sessionValue = await auth.createSessionCookie(idToken, { expiresIn: expiresInMs });
      isSessionCookie = true;
    } catch (err) {
      console.warn("Session cookie creation failed, falling back to ID token.", err);
      sessionValue = idToken;
    }

    const t2 = performance.now();

    try {
        if (isSessionCookie) {
            decoded = await auth.verifySessionCookie(sessionValue, true);
        } else {
            decoded = await auth.verifyIdToken(sessionValue, true);
        }
    } catch (e: any) {
         return NextResponse.json(
            { error: "invalid idToken", cause: e?.message ?? String(e) },
            { status: 401 }
        );
    }
    
    const t3 = performance.now();

    const cookieStore = cookies();
    const isProd = process.env.NODE_ENV === "production";
    const maxAgeSeconds = isSessionCookie ? (60 * 60 * 24 * 5) : (60 * 60);

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

    const t4 = performance.now();

    console.log(`[API TIMING] /api/auth/session: createSessionCookie/fallback took ${t2-t1}ms`);
    console.log(`[API TIMING] /api/auth/session: verify took ${t3-t2}ms`);
    console.log(`[API TIMING] /api/auth/session: setCookies took ${t4-t3}ms`);
    console.log(`[API TIMING] /api/auth/session: total handler took ${t4-t0}ms`);

    return NextResponse.json({ ok: true, uid: decoded.uid });
  } catch (e: any) {
    return NextResponse.json(
      { error: "invalid request", cause: e?.message ?? String(e) },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete('__session');
  cookieStore.delete('tcr_auth');
  return NextResponse.json({ok: true});
}
