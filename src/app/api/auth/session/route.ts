
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  const t0 = performance.now();
  let idToken = "";
  
  // Accept both JSON and raw text idToken bodies
  try {
      const ct = req.headers.get("content-type") ?? "";
      if (ct.includes("application/json")) {
          idToken = (await req.json()).idToken;
      } else {
          idToken = (await req.text()).trim();
      }
  } catch (error) {
      // Ignore parsing errors if body is empty or malformed
  }

  if (!idToken) {
    return NextResponse.json({ error: "missing idToken" }, { status: 400 });
  }

  try {
    // Primary: create a session cookie (24h)
    const expiresIn = 24 * 60 * 60 * 1000;
    const sessionCookie = await adminAuth().createSessionCookie(idToken, { expiresIn });
    const t1 = performance.now();

    cookies().set({
      name: "__session",
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000,
    });
    const t2 = performance.now();
    
    console.log(`[API TIMING] createSessionCookie took ${t1 - t0}ms`);
    console.log(`[API TIMING] cookies().set took ${t2 - t1}ms`);

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
     const t1_fail = performance.now();
     console.warn(`[API TIMING] Initial session cookie creation failed after ${t1_fail - t0}ms. Error: ${(err as Error).message}. Attempting fallback.`);

    // Fallback: If session cookie fails (e.g., permissions), verify the ID token directly.
    try {
      const decoded = await adminAuth().verifyIdToken(idToken, true);
      const t2_fallback = performance.now();

      cookies().set({
        name: "__session_idtoken", // Use a different name for the fallback
        value: idToken, // Store the raw ID token
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60, // 1 hour (standard ID token lifetime)
      });
      const t3_fallback = performance.now();
      
      console.log(`[API TIMING] Fallback verifyIdToken took ${t2_fallback - t1_fail}ms`);
      console.log(`[API TIMING] Fallback cookies().set took ${t3_fallback - t2_fallback}ms`);

      return NextResponse.json({ ok: true, fallback: true, uid: decoded.uid });
    } catch (fallbackErr: unknown) {
      // If both primary and fallback fail, return the original error for debugging.
      const finalError = (err as Error);
      console.error(`[API ERROR] Session creation failed completely. Primary error: ${finalError.message}. Fallback error: ${(fallbackErr as Error).message}`);
      return NextResponse.json(
        { error: "invalid idToken", cause: finalError.message },
        { status: 401 }
      );
    }
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete('__session');
  cookieStore.delete('__session_idtoken');
  return NextResponse.json({ok: true});
}
