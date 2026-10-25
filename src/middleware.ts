import { NextResponse, type NextRequest } from "next/server";

// Lightweight gate: block /admin/* without a session cookie before the page
// renders. Full cryptographic verification happens in the admin layout
// (requireStaff), which also checks the staff record is active.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const hasSession = req.cookies.has("avs_session");
    if (!hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
