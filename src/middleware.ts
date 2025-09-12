import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const protectedRoute = url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/admin");

  if (protectedRoute) {
    const hasFlag = (req.headers.get("cookie") || "").includes("tcr_auth=1");
    if (!hasFlag) {
      const next = encodeURIComponent(url.pathname + url.search);
      url.pathname = "/login";
      url.search = `?next=${next}`;
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/admin/:path*"] };
