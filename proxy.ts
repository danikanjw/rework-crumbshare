import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ambil session cookie Better Auth
  const sessionCookie =
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isLoggedIn = !!sessionCookie;

  // User yang sudah login tidak boleh kembali ke landing page
  if (pathname === "/" && isLoggedIn) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // User yang belum login tidak boleh masuk dashboard
  const protectedRoutes = ["/home", "/donate", "/history", "/profile"];

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home/:path*",
    "/donate/:path*",
    "/history/:path*",
    "/profile/:path*",
  ],
};