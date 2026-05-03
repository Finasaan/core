"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Lock, Sliders, Sparkles, LogOut } from "lucide-react";
import { getUser, logout } from "@/lib/auth/client";
import "./settings.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

type Tab = "profile" | "account" | "preferences";

const knowledgeOptions = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
];

const occupationOptions = [
    { value: "student", label: "Student" },
    { value: "working_professional", label: "Working Professional" },
    { value: "self_employed", label: "Self Employed" },
    { value: "freelancer", label: "Freelancer" },
    { value: "retired", label: "Retired" },
    { value: "other", label: "Other" },
];

const interestOptions = [
    { value: "stock_market", label: "Stock Market" },
    { value: "personal_finance", label: "Personal Finance" },
    { value: "crypto", label: "Crypto" },
    { value: "saving", label: "Saving" },
    { value: "budgeting", label: "Budgeting" },
    { value: "government_support", label: "Government Support" },
    { value: "retirement", label: "Retirement" },
    { value: "real_estate", label: "Real Estate" },
];

interface ProfileData {
    display_name: string;
    financial_knowledge: string;
    occupation: string;
    interests: string[];
}

interface AccountData {
    email: string;
    emailVerified: boolean;
}

function SettingsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab") as Tab | null;
    const activeTab: Tab =
        tabParam === "account" || tabParam === "preferences" ? tabParam : "profile";

    const setTab = useCallback(
        (tab: Tab) => {
            router.replace(`/dashboard/settings?tab=${tab}`);
        },
        [router]
    );

    return (
        <div className="settings-shell">
            <header className="settings-page-header">
                <h1 className="settings-page-title">Settings</h1>
                <p className="settings-page-subtitle">
                    Manage your profile, account security, and preferences.
                </p>
            </header>

            <nav className="settings-tabs" role="tablist">
                <button
                    type="button"
                    className={`settings-tab ${activeTab === "profile" ? "is-active" : ""}`}
                    onClick={() => setTab("profile")}
                    role="tab"
                    aria-selected={activeTab === "profile"}
                >
                    <User size={16} />
                    Profile
                </button>
                <button
                    type="button"
                    className={`settings-tab ${activeTab === "account" ? "is-active" : ""}`}
                    onClick={() => setTab("account")}
                    role="tab"
                    aria-selected={activeTab === "account"}
                >
                    <Lock size={16} />
                    Account
                </button>
                <button
                    type="button"
                    className={`settings-tab ${activeTab === "preferences" ? "is-active" : ""}`}
                    onClick={() => setTab("preferences")}
                    role="tab"
                    aria-selected={activeTab === "preferences"}
                >
                    <Sliders size={16} />
                    Preferences
                </button>
            </nav>

            {activeTab === "profile" && <ProfileSection />}
            {activeTab === "account" && <AccountSection />}
            {activeTab === "preferences" && <PreferencesSection />}
        </div>
    );
}

/* ───────────────────────── Profile section ───────────────────────── */

function ProfileSection() {
    const [profile, setProfile] = useState<ProfileData>({
        display_name: "",
        financial_knowledge: "",
        occupation: "",
        interests: [],
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`${API_URL}/api/profile`, {
                    credentials: "include",
                });
                if (!res.ok) {
                    if (!cancelled) setLoading(false);
                    return;
                }
                const body = (await res.json()) as {
                    success: boolean;
                    data?: Partial<ProfileData> | null;
                };
                if (!cancelled && body.success && body.data) {
                    setProfile({
                        display_name: body.data.display_name ?? "",
                        financial_knowledge: body.data.financial_knowledge ?? "",
                        occupation: body.data.occupation ?? "",
                        interests: body.data.interests ?? [],
                    });
                }
            } catch (e) {
                console.error("Failed to load profile:", e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const toggleInterest = (value: string) => {
        setProfile((p) => ({
            ...p,
            interests: p.interests.includes(value)
                ? p.interests.filter((i) => i !== value)
                : [...p.interests, value],
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!profile.display_name.trim()) {
            setError("Display name is required.");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/api/profile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    display_name: profile.display_name.trim(),
                    financial_knowledge: profile.financial_knowledge || null,
                    occupation: profile.occupation || null,
                    interests: profile.interests,
                }),
            });
            const body = (await res.json()) as { success: boolean; error?: string };
            if (!res.ok || !body.success) {
                setError(body.error ?? "Failed to save profile.");
                return;
            }
            setSuccess("Profile updated.");
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="settings-card">
                <p className="settings-card-subtitle">Loading profile…</p>
            </div>
        );
    }

    return (
        <form className="settings-card" onSubmit={handleSave}>
            <div className="settings-card-header">
                <h2 className="settings-card-title">Profile</h2>
                <p className="settings-card-subtitle">
                    This information personalizes your experience across finasaan.
                </p>
            </div>

            <div className="settings-form">
                {error && (
                    <div className="settings-message is-error" role="alert">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="settings-message is-success" role="status">
                        {success}
                    </div>
                )}

                <div className="settings-field">
                    <label className="settings-field-label" htmlFor="display_name">
                        Display name
                    </label>
                    <input
                        id="display_name"
                        type="text"
                        className="settings-input"
                        value={profile.display_name}
                        onChange={(e) =>
                            setProfile({ ...profile, display_name: e.target.value })
                        }
                        placeholder="Your name"
                        maxLength={64}
                        required
                    />
                </div>

                <div className="settings-row">
                    <div className="settings-field">
                        <label
                            className="settings-field-label"
                            htmlFor="financial_knowledge"
                        >
                            Financial knowledge
                        </label>
                        <select
                            id="financial_knowledge"
                            className="settings-select"
                            value={profile.financial_knowledge}
                            onChange={(e) =>
                                setProfile({
                                    ...profile,
                                    financial_knowledge: e.target.value,
                                })
                            }
                        >
                            <option value="">Not specified</option>
                            {knowledgeOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="settings-field">
                        <label className="settings-field-label" htmlFor="occupation">
                            Occupation
                        </label>
                        <select
                            id="occupation"
                            className="settings-select"
                            value={profile.occupation}
                            onChange={(e) =>
                                setProfile({ ...profile, occupation: e.target.value })
                            }
                        >
                            <option value="">Not specified</option>
                            {occupationOptions.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="settings-field">
                    <label className="settings-field-label">Interests</label>
                    <div className="settings-chip-group">
                        {interestOptions.map((opt) => {
                            const isSelected = profile.interests.includes(opt.value);
                            return (
                                <button
                                    type="button"
                                    key={opt.value}
                                    className={`settings-chip ${isSelected ? "is-selected" : ""}`}
                                    onClick={() => toggleInterest(opt.value)}
                                    aria-pressed={isSelected}
                                >
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>
                    <span className="settings-field-help">
                        Tap a topic to add or remove it. We use these to personalize your
                        feed and learning content.
                    </span>
                </div>

                <div className="settings-actions">
                    <button
                        type="submit"
                        className="settings-button settings-button-primary"
                        disabled={saving}
                    >
                        {saving ? "Saving…" : "Save changes"}
                    </button>
                </div>
            </div>
        </form>
    );
}

/* ───────────────────────── Account section ───────────────────────── */

function AccountSection() {
    const router = useRouter();
    const [account, setAccount] = useState<AccountData | null>(null);
    const [accountLoading, setAccountLoading] = useState(true);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pwSaving, setPwSaving] = useState(false);
    const [pwError, setPwError] = useState<string | null>(null);
    const [pwSuccess, setPwSuccess] = useState<string | null>(null);

    const [signingOut, setSigningOut] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const user = await getUser();
            if (!cancelled) {
                if (user) {
                    setAccount({
                        email: user.email,
                        emailVerified: user.email_confirmed_at != null,
                    });
                }
                setAccountLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwError(null);
        setPwSuccess(null);

        if (newPassword.length < 6) {
            setPwError("New password must be at least 6 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setPwError("New passwords do not match.");
            return;
        }
        if (newPassword === currentPassword) {
            setPwError("New password must be different from your current password.");
            return;
        }

        setPwSaving(true);
        try {
            const res = await fetch(`${API_URL}/api/auth/change-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const body = (await res.json()) as { success: boolean; error?: string };
            if (!res.ok || !body.success) {
                setPwError(body.error ?? "Failed to update password.");
                return;
            }
            setPwSuccess("Password updated.");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch {
            setPwError("An unexpected error occurred. Please try again.");
        } finally {
            setPwSaving(false);
        }
    };

    const handleSignOut = async () => {
        setSigningOut(true);
        try {
            await logout();
            router.push("/login");
            router.refresh();
        } finally {
            setSigningOut(false);
        }
    };

    return (
        <>
            {/* Email */}
            <div className="settings-card">
                <div className="settings-card-header">
                    <h2 className="settings-card-title">Email address</h2>
                    <p className="settings-card-subtitle">
                        The address used to sign in to your account.
                    </p>
                </div>
                <div className="settings-form">
                    <div className="settings-field">
                        <div className="settings-readonly-field">
                            <span className="settings-readonly-value">
                                {accountLoading
                                    ? "Loading…"
                                    : account?.email ?? "Not available"}
                            </span>
                            {account &&
                                (account.emailVerified ? (
                                    <span className="settings-badge is-verified">
                                        Verified
                                    </span>
                                ) : (
                                    <span className="settings-badge is-unverified">
                                        Unverified
                                    </span>
                                ))}
                        </div>
                        <span className="settings-field-help">
                            Changing your email isn't available yet — contact support if
                            you need to update it.
                        </span>
                    </div>
                </div>
            </div>

            {/* Password */}
            <form className="settings-card" onSubmit={handleChangePassword}>
                <div className="settings-card-header">
                    <h2 className="settings-card-title">Change password</h2>
                    <p className="settings-card-subtitle">
                        Use a password you don't reuse on other sites.
                    </p>
                </div>

                <div className="settings-form">
                    {pwError && (
                        <div className="settings-message is-error" role="alert">
                            {pwError}
                        </div>
                    )}
                    {pwSuccess && (
                        <div className="settings-message is-success" role="status">
                            {pwSuccess}
                        </div>
                    )}

                    <div className="settings-field">
                        <label className="settings-field-label" htmlFor="current_password">
                            Current password
                        </label>
                        <input
                            id="current_password"
                            type="password"
                            className="settings-input"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <div className="settings-row">
                        <div className="settings-field">
                            <label
                                className="settings-field-label"
                                htmlFor="new_password"
                            >
                                New password
                            </label>
                            <input
                                id="new_password"
                                type="password"
                                className="settings-input"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                autoComplete="new-password"
                                minLength={6}
                                required
                            />
                        </div>
                        <div className="settings-field">
                            <label
                                className="settings-field-label"
                                htmlFor="confirm_password"
                            >
                                Confirm new password
                            </label>
                            <input
                                id="confirm_password"
                                type="password"
                                className="settings-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                                minLength={6}
                                required
                            />
                        </div>
                    </div>

                    <div className="settings-actions">
                        <button
                            type="submit"
                            className="settings-button settings-button-primary"
                            disabled={
                                pwSaving ||
                                !currentPassword ||
                                !newPassword ||
                                !confirmPassword
                            }
                        >
                            {pwSaving ? "Updating…" : "Update password"}
                        </button>
                    </div>
                </div>
            </form>

            {/* Sign out */}
            <div className="settings-card">
                <div className="settings-card-header">
                    <h2 className="settings-card-title">Sign out</h2>
                    <p className="settings-card-subtitle">
                        Sign out of your account on this device.
                    </p>
                </div>

                <div className="settings-signout-row">
                    <div className="settings-signout-info">
                        <p className="settings-signout-title">Sign out</p>
                        <p className="settings-signout-text">
                            You'll need to sign in again to access your dashboard.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="settings-button settings-button-danger"
                        onClick={handleSignOut}
                        disabled={signingOut}
                    >
                        <LogOut size={16} />
                        {signingOut ? "Signing out…" : "Sign out"}
                    </button>
                </div>
            </div>
        </>
    );
}

/* ───────────────────────── Preferences placeholder ───────────────────────── */

function PreferencesSection() {
    return (
        <div className="settings-card">
            <div className="settings-placeholder">
                <div className="settings-placeholder-icon">
                    <Sparkles size={24} />
                </div>
                <h3 className="settings-placeholder-title">Preferences are on the way</h3>
                <p className="settings-placeholder-text">
                    Theme, notification, and display preferences will live here. We're
                    finishing up the controls — check back soon.
                </p>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <Suspense
            fallback={
                <div className="settings-shell">
                    <div className="settings-card">
                        <p className="settings-card-subtitle">Loading…</p>
                    </div>
                </div>
            }
        >
            <SettingsContent />
        </Suspense>
    );
}
