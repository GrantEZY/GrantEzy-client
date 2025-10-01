import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = ["/login", "/signup"];

// Define routes that should redirect to admin if already authenticated
const authRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get access token from cookies or check if it exists
  const accessToken = request.cookies.get("accessToken")?.value;

  // Check localStorage token (this needs to be done on client side)
  // For server-side middleware, we'll rely on cookies
  const isAuthenticated = !!accessToken;

  // Allow public routes and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // If user is on auth routes (login/signup) and is authenticated, redirect to admin
  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // If user is trying to access protected routes and is not authenticated
  if (
    !publicRoutes.includes(pathname) &&
    !isAuthenticated &&
    pathname !== "/"
  ) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|assets).*)",
  ],
};
