import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import process from "node:process";

export async function GET() {
  try {
    const auth = adminAuth();
    // This object exposes the projectId the Admin SDK believes it’s using
    // @ts-ignore accessing private fields is only for debugging
    const projectId = auth.app.options.projectId || auth.app.options.credential?.projectId;
    return NextResponse.json({
      adminProjectId: projectId ?? "<unknown>",
      clientProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      googleApplicationCredentials: Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
