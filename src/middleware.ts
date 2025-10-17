import { clerkMiddleware } from "@clerk/nextjs/server";

// Protect all routes except public ones
export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const isPublic =
    pathname === "/" || pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  if (!isPublic) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn();
  }
});

// See https://clerk.com/docs/references/nextjs/auth-middleware for matcher details
export const config = {
  matcher: [
    "/((?!.+\\..+|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
