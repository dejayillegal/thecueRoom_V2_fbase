
import "server-only";
import { NextResponse } from "next/server";
import { adminApp } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const app = adminApp();
  return NextResponse.json({
    clientProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    env_FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    admin_app_projectId: app.options.projectId,
    env_ADC: process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || null,
    hasServiceAccount: Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_B64 || process.env.FIREBASE_SERVICE_ACCOUNT_JSON),
  });
}
