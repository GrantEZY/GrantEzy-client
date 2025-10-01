import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = ["/login", "/signup"];

// Define routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get refreshToken from httpOnly cookie set by backend
  // Cookie name is "jwtToken" (contains refreshToken)
  const jwtToken = request.cookies.get("jwtToken")?.value;
  const isAuthenticated = !!jwtToken;

  // Allow public routes and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // If user is on auth routes (login/signup) and is authenticated, redirect to home
  if (authRoutes.includes(pathname) && isAuthenticated) {
    // Redirect to home - role-based redirect happens on client side after login
    return NextResponse.redirect(new URL("/", request.url));
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
