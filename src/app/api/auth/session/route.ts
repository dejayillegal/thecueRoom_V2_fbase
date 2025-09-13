
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminApp, adminAuth } from '@/lib/firebase-admin';

const SESSION_COOKIE = '__session';
const FLAG_COOKIE = 'tcr_auth';

type Body = { idToken?: string; logout?: boolean };

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Body;

    if (body.logout) {
      const c = cookies();
      c.set(SESSION_COOKIE, '', { httpOnly: true, secure: true, path: '/', maxAge: 0, sameSite: 'lax' });
      c.set(FLAG_COOKIE, '', { httpOnly: false, secure: true, path: '/', maxAge: 0, sameSite: 'lax' });
      return NextResponse.json({ ok: true });
    }

    const idToken = body.idToken?.trim();
    if (!idToken) return NextResponse.json({ error: 'missing idToken' }, { status: 400 });

    const app = await adminApp();
    const projectId = app.options.projectId;

    let decoded;
    try {
      decoded = await (await adminAuth()).verifyIdToken(idToken);
    } catch (e: any) {
      return NextResponse.json(
        { error: 'invalid idToken', cause: e?.message, expectedProjectId: projectId },
        { status: 401 }
      );
    }

    const aud = (decoded as any).aud;
    const iss = (decoded as any).iss;
    if (projectId && aud && !String(aud).includes(projectId)) {
      return NextResponse.json(
        { error: 'project mismatch', aud, iss, expectedProjectId: projectId },
        { status: 401 }
      );
    }

    const c = cookies();
    c.set(SESSION_COOKIE, idToken, { httpOnly: true, secure: true, path: '/', sameSite: 'lax', maxAge: 3600 });
    c.set(FLAG_COOKIE, '1', { httpOnly: false, secure: true, path: '/', sameSite: 'lax', maxAge: 3600 });

    return NextResponse.json({ ok: true, uid: decoded.uid, email: decoded.email ?? null });
  } catch (e: any) {
    return NextResponse.json({ error: 'unexpected', cause: e?.message }, { status: 500 });
  }
}

export async function DELETE() {
  const c = cookies();
  c.set(SESSION_COOKIE, '', { httpOnly: true, secure: true, path: '/', maxAge: 0, sameSite: 'lax' });
  c.set(FLAG_COOKIE, '', { httpOnly: false, secure: true, path: '/', maxAge: 0, sameSite: 'lax' });
  return NextResponse.json({ ok: true });
}
