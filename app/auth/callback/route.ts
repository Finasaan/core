import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

/**
 * OAuth callback route handler.
 * Google redirects the user here with a ?code after they authenticate.
 *
 * We call spine server-side (not a browser redirect) so that spine's
 * Set-Cookie headers come back to us. We then forward those cookies to the
 * browser in our own redirect response — this is the only way to set an
 * HttpOnly cookie on localhost:3000 when spine runs on localhost:8787,
 * because browsers scope cookies to the origin that issued them.
 *
 * Spine now determines the redirect destination:
 *   - /dashboard  → returning user (has a user_profiles row)
 *   - /onboarding → new user (no profile yet)
 */
export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
        return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    // Build the spine callback URL.
    // We pass `origin` so spine can build the final redirect URL.
    // We do NOT pass `next` — spine decides that based on profile existence.
    const spineCallbackUrl = new URL(`${API_URL}/api/auth/oauth/callback`);
    spineCallbackUrl.searchParams.set("code", code);
    spineCallbackUrl.searchParams.set("origin", origin);

    // Forward the browser's cookies to spine so it can read sb-pkce-verifier.
    const browserCookies = request.headers.get("cookie") ?? "";

    // Call spine server-to-server, do NOT follow the redirect — we want the
    // Set-Cookie headers from spine's redirect response, not the final page.
    const spineRes = await fetch(spineCallbackUrl.toString(), {
        method: "GET",
        headers: {
            ...(browserCookies ? { cookie: browserCookies } : {}),
        },
        redirect: "manual", // stop at the first redirect to capture Set-Cookie
    });

    // Spine responds with 3xx + Set-Cookie headers (sb-token, sb-refresh-token, pkce clear).
    // Use getSetCookie() to get each cookie as a separate string — headers.get()
    // joins them with ", " which breaks parsing.
    const cookies: string[] = (spineRes.headers as any).getSetCookie?.() ??
        spineRes.headers.get("set-cookie")?.split(/,(?=\s*\w+=)/) ?? [];

    const sbTokenCookie = cookies.find((c) => c.trimStart().startsWith("sb-token="));
    const sbRefreshCookie = cookies.find((c) => c.trimStart().startsWith("sb-refresh-token="));

    if (!sbTokenCookie) {
        console.error("OAuth callback: spine did not return sb-token cookie");
        return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    // Extract the destination from spine's Location header.
    // Spine redirects to origin+/dashboard or origin+/onboarding based on profile check.
    const location = spineRes.headers.get("location") ?? `${origin}/onboarding`;
    // Resolve to just the path in case it's an absolute URL
    let destination: string;
    try {
        const locationUrl = new URL(location);
        destination = locationUrl.pathname;
    } catch {
        destination = location.startsWith("/") ? location : "/onboarding";
    }

    // Redirect the browser to the correct destination and set both auth cookies
    // on core's origin so middleware can read them.
    const response = NextResponse.redirect(`${origin}${destination}`);
    response.headers.append("set-cookie", sbTokenCookie);
    if (sbRefreshCookie) {
        response.headers.append("set-cookie", sbRefreshCookie);
    }
    return response;
}
