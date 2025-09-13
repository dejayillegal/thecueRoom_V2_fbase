import { NextResponse } from 'next/server';
import { adminApp, adminWhoami } from '@/lib/firebase-admin';

export async function GET() {
  const app = await adminApp();
  const who = adminWhoami();
  return NextResponse.json({
    ok: true,
    projectId: app.options.projectId,
    who,
  });
}
