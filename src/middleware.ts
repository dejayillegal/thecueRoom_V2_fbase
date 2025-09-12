
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  if (url.pathname.startsWith("/admin")) {
    const has = (req.headers.get("cookie") || "").includes("tcr_auth=1");
    if (!has) {
      const next = encodeURIComponent(url.pathname + url.search);
      const signInUrl = new URL("/login", url);
      signInUrl.searchParams.set('redirect', next);
      return NextResponse.redirect(signInUrl);
    }
  }
   if (url.pathname.startsWith("/dashboard")) {
    const has = (req.headers.get("cookie") || "").includes("tcr_auth=1");
    if (!has) {
      const next = encodeURIComponent(url.pathname + url.search);
      const signInUrl = new URL("/login", url);
      signInUrl.searchParams.set('redirect', next);
      return NextResponse.redirect(signInUrl);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/dashboard/:path*"] };
