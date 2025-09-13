
import { NextResponse } from "next/server";

function decodeJwt(idToken: string) {
  const [h, p] = idToken.split("."); // ignore signature part
  const b64 = (s: string) => Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
  return { header: JSON.parse(b64(h)), payload: JSON.parse(b64(p)) };
}

export async function POST(req: Request) {
  const { idToken } = await req.json().catch(() => ({}));
  if (!idToken) return NextResponse.json({ error: "missing idToken" }, { status: 400 });
  try {
    const { header, payload } = decodeJwt(idToken);
    return NextResponse.json({
      ok: true,
      header,                              // { alg, kid, typ }
      aud: payload.aud,                    // MUST equal studio-4685889870-4fe96
      iss: payload.iss,                    // https://securetoken.google.com/<project>
      sub: payload.sub,
      iat: payload.iat,
      exp: payload.exp,
      signInProvider: payload.firebase?.sign_in_provider ?? null,
    });
  } catch (e: any) {
    return NextResponse.json({ error: "bad jwt", cause: e?.message }, { status: 400 });
  }
}
