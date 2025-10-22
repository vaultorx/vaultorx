import { auth } from "@/auth";

export default auth((req: any) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

  if (isOnDashboard) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/login", nextUrl));
    }
  }

  if (
    isLoggedIn &&
    (nextUrl.pathname === "/login" || nextUrl.pathname === "/signup")
  ) {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
