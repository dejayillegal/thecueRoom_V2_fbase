import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  
  const protectedRoutes = [
    "/dashboard",
    "/admin",
    "/cover-art",
    "/gigs",
    "/genres",
    "/memes",
    "/news",
    "/settings",
  ];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    const cookieHeader = req.headers.get("cookie") || "";
    // Quick flag set by our session route
    const hasFlag = cookieHeader.includes("tcr_auth=1");
    const hasSession = cookieHeader.includes("__session=");
    
    if (!(hasFlag && hasSession)) {
      const redirectUrl = new URL("/login", req.url);
      // Construct the 'next' path correctly as a string
      const nextPath = pathname + search;
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
