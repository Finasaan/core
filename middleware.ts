import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/onboarding", "/profile", "/settings"];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  // Check if this is the preview environment
  const isPreview =
    process.env.ENVIRONMENT === "preview" ||
    request.headers.get("cf-worker") === "core-preview" ||
    request.nextUrl.hostname.includes("preview") ||
    request.nextUrl.pathname.startsWith("/preview");

  // If in preview environment and URL starts with /preview, rewrite to remove it
  if (isPreview && request.nextUrl.pathname.startsWith("/preview")) {
    const newPathname =
      request.nextUrl.pathname.replace(/^\/preview/, "") || "/";
    const url = request.nextUrl.clone();
    url.pathname = newPathname;

    const response = NextResponse.rewrite(url);
    response.headers.set("x-preview-rewrite", "true");
    return response;
  }

  // Update Supabase session and get user
  const { user, supabaseResponse } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  // Check if current path matches protected routes
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Check if current path matches auth routes
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
