"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";

function LoginForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
    const isRegistered = searchParams.get("registered") === "true";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Invalid credentials. Please try again.");
            setLoading(false);
        } else {
            router.push(callbackUrl);
        }
    };

    return (
        <div className="bg-card p-8 rounded-lg shadow-lg border border-border w-full max-w-md flex flex-col items-center gap-6">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-rajdhani font-bold">Sign In</h1>
                <p className="text-text/80">
                    Sign in to manage your collection on Checkpoint.
                </p>
                {isRegistered && (
                    <p className="text-green-500 text-sm font-semibold">Account created! Please sign in.</p>
                )}
            </div>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                <div>
                    <label className="text-sm font-semibold text-text mb-1 block">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-background border border-border rounded px-3 py-2 text-text focus:outline-none focus:border-accent"
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-semibold text-text mb-1 block">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-background border border-border rounded px-3 py-2 text-text focus:outline-none focus:border-accent"
                        required
                    />
                </div>
                
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent hover:bg-accent/80 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                >
                    {loading ? "Loading..." : "Sign in with Email"}
                </button>
            </form>

            <div className="w-full flex items-center gap-4 text-sm text-text/50">
                <div className="h-px bg-border flex-1"></div>
                <span>OR</span>
                <div className="h-px bg-border flex-1"></div>
            </div>

            <button
                onClick={() => signIn("github", { callbackUrl })}
                className="w-full flex items-center justify-center gap-3 bg-[#24292e] hover:bg-[#2f363d] text-white px-6 py-2 rounded-md font-semibold transition-colors duration-200"
            >
                <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
                Continue with GitHub
            </button>

            <p className="text-sm text-text/70">
                Don't have an account? <Link href="/register" className="text-accent hover:underline">Sign up here</Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
            <Suspense fallback={<div className="text-accent font-rajdhani">Loading...</div>}>
                <LoginForm/>
            </Suspense>
        </div>
    );
}