import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Allow public paths
  const publicPaths = ["/login", "/signup", "/reset-password", "/api/auth/session", "/api/admin/seed"];
  if (publicPaths.some(p => req.nextUrl.pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow root path
  if (req.nextUrl.pathname === '/') {
    return NextResponse.next();
  }

  // Require a session cookie for all other routes
  const hasSession = req.cookies.has("__session");
  
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/debug|_next/static|_next/image|favicon.ico).*)'],
};
