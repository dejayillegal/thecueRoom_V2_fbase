
import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST() {
  try {
    const auth = await adminAuth();
    const users = [
      { email: 'dejayillegal@gmail.com', password: 'Closer@82', claims: { admin: true } },
      { email: 'test@thecueroom.xyz', password: 'Test@123', claims: {} },
      { email: 'jmunuswa@gmail.com', password: 'Closer@82', claims: {} },
    ];
    const results: any[] = [];
    for (const { email, password, claims } of users) {
      let user;
      try {
        user = await auth.getUserByEmail(email);
        // Update existing user with new password
        await auth.updateUser(user.uid, { password });
      } catch {
        // Create the user if it doesn't exist
        user = await auth.createUser({ email, password });
      }
      if (claims && Object.keys(claims).length > 0) {
        await auth.setCustomUserClaims(user.uid, claims);
      }
      results.push({ uid: user.uid, email });
    }
    return NextResponse.json({ ok: true, users: results });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ ok: false, error: error.message ?? String(err) }, { status: 500 });
  }
}
