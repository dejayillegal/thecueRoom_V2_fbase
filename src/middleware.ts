import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;
  
  const protectedRoute =
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/admin") ||
    pathname.startsWith("/cover-art") ||
    pathname.startsWith("/gigs") ||
    pathname.startsWith("/genres") ||
    pathname.startsWith("/memes") ||
    pathname.startsWith("/news") ||
    pathname.startsWith("/settings");


  if (protectedRoute) {
    const cookieHeader = req.headers.get("cookie") || "";
    // Quick flag set by our session route
    const hasFlag = cookieHeader.includes("tcr_auth=1");
    const hasSession = cookieHeader.includes("__session=");
    if (!(hasFlag && hasSession)) {
      const redirectUrl = new URL("/login", req.url);
      // Construct the 'next' path correctly as a string
      const nextPath = pathname + url.search;
      redirectUrl.searchParams.set("next", nextPath);
      return NextResponse.redirect(redirectUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  // We check for protected routes inside the middleware now, 
  // so the matcher can be broader. This covers all routes except for static assets and API routes.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
