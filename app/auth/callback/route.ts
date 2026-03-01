import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

/**
 * OAuth callback route handler.
 * Google redirects the user here with a ?code after they authenticate.
 * We proxy the code to spine, which exchanges it for a session, sets the
 * HttpOnly cookie, and redirects the browser to /onboarding.
 */
export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/onboarding";

    if (!code) {
        return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    // Forward the code to spine's OAuth callback handler.
    // We follow the redirect that spine issues (it will go back to origin/next).
    const spineCallbackUrl = new URL(`${API_URL}/api/auth/oauth/callback`);
    spineCallbackUrl.searchParams.set("code", code);
    spineCallbackUrl.searchParams.set("next", next);

    // Redirect the browser to spine so it can set the HttpOnly cookie directly.
    return NextResponse.redirect(spineCallbackUrl.toString());
}
