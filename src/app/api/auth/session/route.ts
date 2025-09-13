
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

const MAX_AGE_DAYS = 14;

export async function POST(request: Request) {
  try {
    let body: any = null;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
    }

    const idToken = body?.idToken as string | undefined;
    if (!idToken) {
      return NextResponse.json({ error: 'missing idToken' }, { status: 400 });
    }

    const auth = adminAuth();
    // ⬇️ No revocation check until IAM is fixed
    await auth.verifyIdToken(idToken, false);

    const expiresIn = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    const domain = process.env.NEXT_COOKIE_DOMAIN || undefined;
    const secure =
      process.env.NEXT_COOKIE_SECURE === 'true' ||
      (process.env.NODE_ENV === 'production' && domain !== 'localhost');

    cookies().set('session', sessionCookie, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: expiresIn / 1000,
      path: '/',
      domain,
    });
    
    // Also set a client-readable flag
    cookies().set('tcr_auth', "1", {
      httpOnly: false,
      secure,
      sameSite: 'lax',
      maxAge: expiresIn / 1000,
      path: '/',
      domain,
    });


    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    // surface the *real* Admin error to the client (helps debugging)
    return NextResponse.json(
      { error: 'unexpected error in session route', cause: String(err?.message || err) },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const domain = process.env.NEXT_COOKIE_DOMAIN || undefined;
  cookies().set('session', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0, sameSite: 'lax', domain });
  cookies().set('tcr_auth', '', { httpOnly: false, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0, sameSite: 'lax', domain });
  return NextResponse.json({ ok: true });
}
