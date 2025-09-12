
import "server-only";
import { NextResponse } from "next/server";
import { adminApp } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";
export async function GET() {
  const adminProject = adminApp.options.projectId;
  return NextResponse.json({
    client: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    },
    admin: { projectId: adminProject },
    runtime: process.env.NODE_ENV,
  });
}
