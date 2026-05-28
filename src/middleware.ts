import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userId = request.cookies.get("userId")?.value;

  // Auto-redirect logged in users visiting landing page to journal
  if (pathname === "/" && userId) {
    const url = request.nextUrl.clone();
    url.pathname = "/journal";
    return NextResponse.redirect(url);
  }

  // Define public paths that do not require authentication
  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") // static files
  ;

  if (!isPublic) {
    if (!userId) {
      // Redirect to the home page if not logged in
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
