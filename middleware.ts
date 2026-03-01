import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/onboarding", "/profile", "/settings", "/chat"];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Preview environment: rewrite /preview/* paths to strip the prefix
    const isPreview =
        process.env.ENVIRONMENT === "preview" ||
        request.headers.get("cf-worker") === "core-preview" ||
        request.nextUrl.hostname.includes("preview") ||
        pathname.startsWith("/preview");

    if (isPreview && pathname.startsWith("/preview")) {
        const newPathname = pathname.replace(/^\/preview/, "") || "/";
        const url = request.nextUrl.clone();
        url.pathname = newPathname;
        const response = NextResponse.rewrite(url);
        response.headers.set("x-preview-rewrite", "true");
        return response;
    }

    // Presence of the sb-token HttpOnly cookie indicates an active session.
    // Full JWT validation is enforced by spine's authMiddleware on every API call.
    const hasSession = request.cookies.has("sb-token");

    const isProtectedRoute = protectedRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    const isAuthRoute = authRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    const isOnboardingRoute =
        pathname === "/onboarding" || pathname.startsWith("/onboarding/");

    // Redirect unauthenticated users away from protected pages
    if (isProtectedRoute && !hasSession) {
        const redirectUrl = new URL("/login", request.url);
        redirectUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(redirectUrl);
    }

    // Guard: authenticated users visiting /onboarding who have already completed
    // it should be sent to /dashboard instead.
    if (isOnboardingRoute && hasSession) {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
            const profileRes = await fetch(`${API_URL}/api/profile`, {
                headers: { cookie: request.headers.get("cookie") ?? "" },
            });
            if (profileRes.ok) {
                const body = await profileRes.json() as { success: boolean; data: unknown };
                if (body.success && body.data !== null) {
                    // User already has a profile — skip onboarding
                    return NextResponse.redirect(new URL("/dashboard", request.url));
                }
            }
        } catch {
            // Profile API unreachable — let the request through; onboarding is
            // idempotent (upsert) so a second run won't corrupt data.
        }
    }

    // Redirect authenticated users away from login/signup —
    // but first validate the session against spine, because the cookie
    // may be stale (e.g. account deleted) and middleware only checks presence.
    if (isAuthRoute && hasSession) {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
            const meRes = await fetch(`${API_URL}/api/auth/me`, {
                headers: { cookie: request.headers.get("cookie") ?? "" },
            });
            if (meRes.ok) {
                // Valid session — send authenticated user to dashboard
                return NextResponse.redirect(new URL("/dashboard", request.url));
            }
            // 401 / invalid — stale cookie. Clear both auth cookies and let
            // the user reach the login/signup page.
            const response = NextResponse.next();
            response.cookies.delete("sb-token");
            response.cookies.delete("sb-refresh-token");
            return response;
        } catch {
            // Spine unreachable — fail open so the user can still reach login
            return NextResponse.next();
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
