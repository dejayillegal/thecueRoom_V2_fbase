
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  
  const isDashboardRoute = url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/admin");

  if (isDashboardRoute) {
    const hasAuthCookie = (req.headers.get("cookie") || "").includes("tcr_auth=1");
    if (!hasAuthCookie) {
      const next = encodeURIComponent(url.pathname + url.search);
      const signInUrl = new URL("/login", url);
      signInUrl.searchParams.set('next', next);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/dashboard/:path*"] };
