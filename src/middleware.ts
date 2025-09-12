
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isProtected) {
    const flag = req.cookies.get("tcr_auth")?.value;
    if (flag !== "1") {
      const next = encodeURIComponent(pathname + search);
      const url = req.nextUrl.clone();
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
