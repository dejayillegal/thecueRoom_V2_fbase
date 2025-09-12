import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  const cookieStore = cookies();
  try {
    const body = await req.text();
    let idToken: string;
    try {
      const parsed = JSON.parse(body);
      idToken = parsed.idToken;
    } catch (parseError) {
      console.error("Session POST JSON parse error:", parseError);
      return NextResponse.json(
        { error: "invalid_request", message: "Malformed JSON payload" },
        { status: 400 }
      );
    }

    if (!idToken) {
      return NextResponse.json(
        { error: "missing idToken" },
        { status: 400 }
      );
    }

    let decodedToken;
    try {
      decodedToken = await adminAuth().verifyIdToken(idToken, true);
    } catch (verifyError: any) {
      console.error("Session POST token verification failed:", verifyError);
      const errMessage = verifyError?.message || String(verifyError);
      return NextResponse.json(
        { error: "invalid idToken", cause: errMessage },
        { status: 401 }
      );
    }

    // On successful verification, set session cookies
    cookieStore.set("__session", idToken, {
      httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24,
    });
    cookieStore.set("tcr_auth", "1", {
      httpOnly: false, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24,
    });
    return NextResponse.json({ ok: true, uid: decodedToken.uid });
  } catch (err) {
    console.error("Session POST unexpected error:", err);
    return NextResponse.json(
      { error: "server_error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete("__session");
  cookieStore.delete("tcr_auth");
  return NextResponse.json({ ok: true });
}
