import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/resest-password",
  "/exhibitions",
  "/collections",
  "/marketplace",
  "/nft",
  "/api/auth",
  "/api/nfts",
  "/api/exhibitions",
  "/api/auctions",
  "/api/categories",
  "/api/collections",
  "/_next",
  "/favicon.ico",
  "/",
];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isPublicRoute = publicRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Allow public routes and static files
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated and trying to access protected routes
  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return Response.redirect(loginUrl);
  }

  // Redirect to dashboard if authenticated and trying to access auth pages
  if (
    isLoggedIn &&
    (nextUrl.pathname === "/login" || nextUrl.pathname === "/signup")
  ) {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});


export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/dashboard/:path*",
    "/api/wallet/:path*",
    "/api/user/:path*",
    "/api/transactions/:path*",
    "/api/deposit/:path*",
  ],
};
