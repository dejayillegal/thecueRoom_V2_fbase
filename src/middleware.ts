import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const protectedRoute =
    url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/admin");

  if (protectedRoute) {
    const cookieHeader = req.headers.get("cookie") || "";
    // Quick flag set by our session route
    const hasFlag = cookieHeader.includes("tcr_auth=1");
    const hasSession = cookieHeader.includes("__session=");
    if (!(hasFlag && hasSession)) {
      const next = encodeURIComponent(url.pathname + url.search);
      url.pathname = "/login";
      url.search = `?next=${next}`;
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
