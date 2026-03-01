import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/onboarding", "/profile", "/settings"];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
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

    // Redirect unauthenticated users away from protected pages
    if (isProtectedRoute && !hasSession) {
        const redirectUrl = new URL("/login", request.url);
        redirectUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(redirectUrl);
    }

    // Redirect authenticated users away from login/signup
    if (isAuthRoute && hasSession) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
