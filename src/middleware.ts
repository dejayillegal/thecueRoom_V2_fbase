
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  
  if (url.pathname.startsWith("/admin")) {
    const hasSession = req.cookies.has("__session");
    
    // Allow API routes for health checks to pass through without session cookie
    if (url.pathname.startsWith('/api/')) {
      return NextResponse.next();
    }
      
    if (!hasSession) {
      // For browser navigation, redirect to a sign-in page
      if (req.headers.get('accept')?.includes('text/html')) {
        const signInUrl = new URL("/login", url);
        signInUrl.searchParams.set('redirect', url.pathname);
        return NextResponse.redirect(signInUrl);
      }
      // For API-like requests, return a 401
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = { 
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*", // Example if you had admin-only API routes
  ] 
};
