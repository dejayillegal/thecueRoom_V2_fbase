import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

/**
 * Seeds the database with an admin user and two test users.  Running this
 * endpoint will create or update the specified accounts and set an admin
 * custom claim on the admin user.  Note: this route should be protected
 * in production; ideally only callable via secure backend or CLI.
 */
export async function POST() {
  try {
    const users = [
      { email: 'dejayillegal@gmail.com', password: 'Closer@82', claims: { admin: true } },
      { email: 'test@thecueroom.xyz', password: 'Test@123', claims: {} },
      { email: 'jmunuswa@gmail.com', password: 'Closer@82', claims: {} },
    ];
    const results: any[] = [];
    for (const { email, password, claims } of users) {
      let user;
      try {
        user = await adminAuth().getUserByEmail(email);
        // Update existing user with new password
        await adminAuth().updateUser(user.uid, { password });
      } catch {
        // Create the user if it doesn't exist
        user = await adminAuth().createUser({ email, password });
      }
      if (claims && Object.keys(claims).length > 0) {
        await adminAuth().setCustomUserClaims(user.uid, claims);
      }
      results.push({ uid: user.uid, email });
    }
    return NextResponse.json({ ok: true, users: results });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ ok: false, error: error.message ?? String(err) }, { status: 500 });
  }
}
