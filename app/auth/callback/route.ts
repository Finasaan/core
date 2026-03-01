import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

/**
 * OAuth callback route handler.
 * Google redirects the user here with a ?code after they authenticate.
 *
 * We call spine server-side (not a browser redirect) so that spine's
 * Set-Cookie header comes back to us. We then forward that cookie to the
 * browser in our own redirect response — this is the only way to set an
 * HttpOnly cookie on localhost:3000 when spine runs on localhost:8787,
 * because browsers scope cookies to the origin that issued them.
 */
export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/onboarding";

    if (!code) {
        return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    // Build the spine callback URL.
    const spineCallbackUrl = new URL(`${API_URL}/api/auth/oauth/callback`);
    spineCallbackUrl.searchParams.set("code", code);
    spineCallbackUrl.searchParams.set("next", next);
    spineCallbackUrl.searchParams.set("origin", origin);

    // Forward the browser's cookies to spine so it can read sb-pkce-verifier.
    const browserCookies = request.headers.get("cookie") ?? "";

    // Call spine server-to-server, do NOT follow the redirect — we want the
    // Set-Cookie header from spine's redirect response, not the final page.
    const spineRes = await fetch(spineCallbackUrl.toString(), {
        method: "GET",
        headers: {
            ...(browserCookies ? { cookie: browserCookies } : {}),
        },
        redirect: "manual", // stop at the first redirect to capture Set-Cookie
    });

    // Spine responds with 3xx + two Set-Cookie headers (sb-token + pkce clear).
    // Use getSetCookie() to get each cookie as a separate string — headers.get()
    // joins them with ", " which breaks parsing.
    const cookies: string[] = (spineRes.headers as any).getSetCookie?.() ??
        spineRes.headers.get("set-cookie")?.split(/,(?=\s*\w+=)/) ?? [];

    const sbTokenCookie = cookies.find((c) => c.trimStart().startsWith("sb-token="));

    if (!sbTokenCookie) {
        console.error("OAuth callback: spine did not return sb-token cookie");
        return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    // Redirect the browser to /onboarding and set the sb-token cookie on
    // core's origin (localhost:3000) so middleware can read it.
    const response = NextResponse.redirect(`${origin}${next}`);
    response.headers.set("set-cookie", sbTokenCookie);
    return response;
}

