'use server';
import "server-only";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email query parameter is required" }, { status: 400 });
  }

  try {
    const userRecord = await adminAuth.getUserByEmail(email);
    const { uid, customClaims } = userRecord;
    return NextResponse.json({
      found: true,
      uid,
      email,
      customClaims: customClaims || null,
    });
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      return NextResponse.json({ found: false, email, error: "User not found in this Firebase project." }, { status: 404 });
    }
    return NextResponse.json({ found: false, email, error: error.message }, { status: 500 });
  }
}
