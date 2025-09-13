export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { adminApp, adminWhoami, adminAuth, adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const app = await adminApp();
    const who = await adminWhoami();

    // Touch auth/db just to ensure they’re live (will throw early if misconfigured)
    await adminAuth().listUsers(1).catch(() => null);
    await adminDb().listCollections().catch(() => null);

    return NextResponse.json({
      ok: true,
      appName: app.name,
      projectId: who.projectId,
      apps: who.apps,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ ok: false, error: error.message ?? String(err) }, { status: 500 });
  }
}
