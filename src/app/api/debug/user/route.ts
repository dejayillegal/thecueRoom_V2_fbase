
'use server';
import "server-only";
import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { adminApp } from "@/lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email query parameter is required" }, { status: 400 });
  }

  try {
    const u = await getAuth(adminApp()).getUserByEmail(email);
    return NextResponse.json({ uid: u.uid, email: u.email, disabled: u.disabled, claims: u.customClaims ?? {} });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e) }, { status: 404 });
  }
}
