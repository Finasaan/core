import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * OAuth callback route handler
 * Handles the redirect from OAuth providers (Google, etc.)
 * Exchanges the auth code for a session
 */
export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/onboarding";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Successful auth - redirect to the intended destination
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // Auth failed - redirect to login with error
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
