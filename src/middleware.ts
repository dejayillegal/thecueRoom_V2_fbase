
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Allow public paths
  const publicPaths = ["/login", "/signup", "/reset-password", "/api/auth/session", "/api/admin/seed", "/api/debug/firebase", "/api/debug/user", "/api/news/warm"];
  if (req.nextUrl.pathname === '/' || publicPaths.some(p => req.nextUrl.pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Require a session cookie
  const hasSession = req.cookies.has("__session");
    
  if (!hasSession) {
    const url = req.nextUrl.clone();
    // Use .get() to safely access search parameters without enumeration
    const nextPath = req.nextUrl.searchParams.get("next") || req.nextUrl.pathname;
    url.pathname = "/login";
    url.searchParams.set("next", nextPath);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt).*)'],
};
