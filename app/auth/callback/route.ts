import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Spine API base URL - uses localhost in dev, relative path in production (via service binding)
const SPINE_API_URL = process.env.SPINE_API_URL || "http://localhost:8787";

/**
 * OAuth callback route handler
 * Handles the redirect from OAuth providers (Google, etc.)
 * Exchanges the auth code for a session and determines redirect destination
 * by calling spine to check onboarding status.
 */
export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // Allow explicit next param to override automatic routing
    const explicitNext = searchParams.get("next");

    if (code) {
        const supabase = await createClient();
        const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && sessionData.user) {
            // If explicit next param provided, use it
            if (explicitNext) {
                return NextResponse.redirect(`${origin}${explicitNext}`);
            }

            try {
                // Call spine to check onboarding status
                const statusResponse = await fetch(
                    `${SPINE_API_URL}/api/auth/onboarding-status/${sessionData.user.id}`
                );

                if (statusResponse.ok) {
                    const statusData = await statusResponse.json() as {
                        success: boolean;
                        data?: { hasCompletedOnboarding: boolean };
                    };
                    const destination = statusData.data?.hasCompletedOnboarding
                        ? "/dashboard"
                        : "/onboarding";
                    return NextResponse.redirect(`${origin}${destination}`);
                }
            } catch (fetchError) {
                console.error("Failed to check onboarding status via spine:", fetchError);
            }

            // Fallback: if spine call fails, default to onboarding for safety
            return NextResponse.redirect(`${origin}/onboarding`);
        }
    }

    // Auth failed - redirect to login with error
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}

