
export const runtime = 'nodejs';

import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) return new Response("Missing idToken", { status: 400 });

    const isProd = process.env.NODE_ENV === "production";
    const maxAge = 5 * 24 * 60 * 60; // 5 days (seconds)

    cookies().set("__session", idToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge,
    });
    cookies().set("tcr_auth", "1", {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json" } });
  } catch (e: any) {
    console.error("session POST error", e);
    return new Response("Session error", { status: 500 });
  }
}

export async function DELETE() {
  cookies().set("__session", "", { httpOnly: true, secure: false, sameSite: "lax", path: "/", maxAge: 0 });
  cookies().set("tcr_auth", "", { httpOnly: true, secure: false, sameSite: "lax", path: "/", maxAge: 0 });
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
  });
}
