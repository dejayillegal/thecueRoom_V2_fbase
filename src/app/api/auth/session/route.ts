
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
    }

    const { idToken } = body as { idToken?: string };
    if (!idToken) {
      return NextResponse.json({ error: 'missing idToken' }, { status: 400 });
    }

    const auth = await adminAuth();

    // ⬇️ No revocation check until IAM is fixed
    await auth.verifyIdToken(idToken, false);

    // 14-day session
    const expiresIn = 14 * 24 * 60 * 60 * 1000;
    const cookie = await auth.createSessionCookie(idToken, { expiresIn });

    const domain = process.env.NEXT_COOKIE_DOMAIN || undefined;
    const secure =
      process.env.NEXT_COOKIE_SECURE === 'true' ||
      (process.env.NODE_ENV === 'production' && domain !== 'localhost');

    const res = NextResponse.json({ ok: true }, { status: 200 });
    res.cookies.set('session', cookie, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge: expiresIn / 1000,
      domain,
    });
    // Also set a client-readable flag
    res.cookies.set('tcr_auth', "1", {
      httpOnly: false,
      secure,
      sameSite: 'lax',
      maxAge: expiresIn / 1000,
      path: '/',
      domain,
    });

    return res;
  } catch (e: any) {
    return NextResponse.json(
      { error: 'unexpected error in session route', cause: e?.message ?? 'unknown' },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const domain = process.env.NEXT_COOKIE_DOMAIN || undefined;
  const res = NextResponse.json({ ok: true });
  res.cookies.set('session', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0, sameSite: 'lax', domain });
  res.cookies.set('tcr_auth', '', { httpOnly: false, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 0, sameSite: 'lax', domain });
  return res;
}
