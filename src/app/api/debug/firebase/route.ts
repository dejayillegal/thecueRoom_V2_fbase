
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { adminWhoami, adminAuth, adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const who = await adminWhoami();

    // Touch auth/db just to ensure they’re live (will throw early if misconfigured)
    const auth = await adminAuth();
    await auth.listUsers(1).catch(() => null);

    const db = await adminDb();
    await db.listCollections().catch(() => null);

    return NextResponse.json({
      ok: true,
      appName: who.appName,
      projectId: who.projectId,
      apps: who.apps,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ ok: false, error: error.message ?? String(err) }, { status: 500 });
  }
}
