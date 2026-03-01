/**
 * Auth client — all auth is handled by spine (the backend).
 * The `sb-token` cookie is HttpOnly and sent automatically on every
 * same-origin request; we never read or pass it manually.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export interface AuthUser {
    id: string;
    email: string;
    email_confirmed_at: string | null;
    created_at: string;
    updated_at: string;
    user_metadata: Record<string, unknown>;
}

/**
 * Returns the current user from spine, or null if unauthenticated.
 */
export async function getUser(): Promise<AuthUser | null> {
    try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
            credentials: "include",
        });
        if (!res.ok) return null;
        const body = await res.json() as { success: boolean; data?: AuthUser };
        return body.success && body.data ? body.data : null;
    } catch {
        return null;
    }
}

/**
 * Returns true if there is an active session.
 */
export async function isAuthenticated(): Promise<boolean> {
    return (await getUser()) !== null;
}

/**
 * Signs the user out via spine (invalidates session server-side, clears cookie).
 */
export async function logout(): Promise<void> {
    await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
    });
}
