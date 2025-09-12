import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const needsAuth =
    url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/admin");

  if (needsAuth) {
    const cookie = req.headers.get("cookie") || "";
    const hasFlag = cookie.includes("tcr_auth=1");
    const hasToken = cookie.includes("__session=");
    if (!hasFlag && !hasToken) {
      const next = encodeURIComponent(url.pathname + url.search);
      const to = new URL("/login", url);
      to.searchParams.set("next", next);
      return NextResponse.redirect(to);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/dashboard/:path*"] };
