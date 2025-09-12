
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  
  const isProtected = url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/admin");

  if (isProtected) {
    // Check for the simple, non-HttpOnly cookie
    const hasAuthCookie = req.cookies.get("tcr_auth")?.value === "1";
    if (!hasAuthCookie) {
      const signInUrl = new URL("/login", url);
      signInUrl.searchParams.set('next', url.pathname); // Pass the intended destination
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/dashboard/:path*"] };
