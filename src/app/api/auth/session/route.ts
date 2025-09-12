import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {adminAuth} from '@/lib/firebase-admin';

export async function POST(req: Request) {
  const cookieStore = cookies();
  try {
    const body = await req.text();
    let idToken: string;
    try {
      const parsed = JSON.parse(body);
      idToken = parsed.idToken;
    } catch (parseError) {
      console.error('Session POST JSON parse error:', parseError);
      return NextResponse.json(
        {error: 'invalid_request', message: 'Malformed JSON payload'},
        {status: 400}
      );
    }

    if (!idToken) {
      return NextResponse.json(
        {error: 'missing idToken'},
        {status: 400}
      );
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth().createSessionCookie(idToken, {expiresIn});

    // On successful verification, set session cookies
    cookieStore.set('__session', sessionCookie, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: expiresIn / 1000,
    });
    cookieStore.set('tcr_auth', '1', {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: expiresIn / 1000,
    });
    
    const decodedToken = await adminAuth().verifyIdToken(idToken, true);
    return NextResponse.json({ ok: true, uid: decodedToken.uid });

  } catch (error: any) {
    console.error("Session POST error:", error);
    return NextResponse.json(
      { error: "invalid idToken", cause: error.message || String(error) },
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
