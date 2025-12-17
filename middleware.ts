import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Spine API base URL
const SPINE_API_URL = process.env.SPINE_API_URL || "http://localhost:8787";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/onboarding", "/profile", "/settings"];

// Routes where we should check onboarding completion (excludes onboarding routes)
const requiresOnboardingCheck = ["/dashboard", "/profile", "/settings"];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/signup"];

// Onboarding routes (user can access these even without completing onboarding)
const onboardingRoutes = ["/onboarding"];

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

  // Check route types
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const isOnboardingRoute = onboardingRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const needsOnboardingCheck = requiresOnboardingCheck.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // For authenticated users on routes that require onboarding check
  if (user && needsOnboardingCheck) {
    try {
      // Call spine to check if user has completed onboarding
      const statusResponse = await fetch(
        `${SPINE_API_URL}/api/auth/onboarding-status/${user.id}`,
        {
          // Short timeout to avoid blocking requests
          signal: AbortSignal.timeout(3000)
        }
      );

      if (statusResponse.ok) {
        const statusData = await statusResponse.json() as {
          success: boolean;
          data?: { hasCompletedOnboarding: boolean };
        };

        // If user hasn't completed onboarding, redirect them
        if (!statusData.data?.hasCompletedOnboarding) {
          return NextResponse.redirect(new URL("/onboarding", request.url));
        }
      }
    } catch (error) {
      // If spine call fails, log but don't block the request
      console.error("Failed to check onboarding status:", error);
    }
  }

  // Redirect authenticated users from auth routes to dashboard
  // But only if they've completed onboarding (checked above for dashboard)
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

