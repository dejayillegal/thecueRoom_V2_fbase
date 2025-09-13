
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Allow public paths
  const publicPaths = ["/login", "/signup", "/reset-password", "/api/auth/session", "/api/admin/seed", "/api/debug/firebase", "/api/debug/user", "/api/news/warm"];
  if (req.nextUrl.pathname === '/' || publicPaths.some(p => req.nextUrl.pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Require a session cookie
  const hasSession =
    req.cookies.has("__session") || req.cookies.has("__session_idtoken");
    
  if (!hasSession) {
    const url = req.nextUrl.clone();
    const nextPath = req.nextUrl.pathname + req.nextUrl.search;
    url.pathname = "/login";
    url.searchParams.set("next", nextPath);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt).*)'],
};
