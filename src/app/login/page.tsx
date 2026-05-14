"use client";

import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { LogoIcon } from "@/components/ui/Icons";

function LoginForm() {
    const { status } = useSession();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const isRegistered = searchParams.get("registered") === "true";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === "authenticated") {
            window.location.href = callbackUrl;
        }
    }, [status, callbackUrl]);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!email) {
            setLoading(false);
            return setError("Identity required. Please enter your Email.");
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setLoading(false);
            return setError("Access denied: Invalid credentials or identity not found.");
        }

        if (!password) {
            setLoading(false);
            return setError("Password missing. Access denied.");
        }

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            const errorMsg = res.error.toUpperCase();
            
            if (errorMsg.includes("INVALID_LOGIN_CREDENTIALS") || errorMsg.includes("EMAIL_NOT_FOUND") || errorMsg.includes("INVALID_PASSWORD") || errorMsg.includes("INVALID_EMAIL")) {
                setError("Access denied: Invalid credentials or identity not found.");
            } else if (errorMsg.includes("USER_DISABLED")) {
                setError("Protocol violation: This account has been locked.");
            } else if (errorMsg.includes("TOO_MANY_ATTEMPTS_TRY_LATER")) {
                setError("Mainframe overload: Too many attempts. Try later.");
            } else {
                setError("Neural connection failure. Try again.");
            }
            setLoading(false);
        } else {
            // Hard navigation para garantizar que la cookie llegue al servidor
            window.location.href = callbackUrl;
        }
    };

    if (status === "authenticated") {
        return <div className="text-primary font-rajdhani text-2xl uppercase tracking-widest animate-pulse">Redirecting...</div>;
    }

    return (
        <div className="relative w-full max-w-md p-8 bg-gray-900/60 backdrop-blur-xl border border-gray-800 shadow-2xl overflow-hidden rounded-xl z-10">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-tertiary to-accent"></div>

            <div className="flex flex-col items-center mb-8 space-y-3">
                <div className="text-primary animate-pulse duration-3000">
                    <LogoIcon className="w-15 h-15" />
                </div>
                <h1 className="text-4xl font-rajdhani font-bold uppercase tracking-widest text-text">
                    Sign In
                </h1>
                <p className="text-gray-400 text-sm font-medium">
                    Continue to manage your collection on Checkpoint.
                </p>
                {isRegistered && (
                    <div className="w-full mt-2 p-3 bg-secondary/10 border border-secondary/30 rounded text-secondary text-sm font-semibold text-center uppercase tracking-wider">
                        Account created! Please sign in.
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} noValidate className="w-full flex flex-col gap-5">
                <div className="space-y-1.5">
                    <label className="text-xs font-rajdhani font-bold uppercase tracking-widest text-gray-400">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@mail.com"
                        className="w-full bg-black/50 border border-gray-800 rounded px-4 py-3 text-text placeholder:text-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-300"
                        required
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-rajdhani font-bold uppercase tracking-widest text-gray-400">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black/50 border border-gray-800 rounded px-4 py-3 text-text placeholder:text-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-300"
                        required
                    />
                </div>
                
                {error && (
                    <p className="text-danger text-sm text-center font-semibold bg-danger/10 py-2 border border-danger/20 rounded">
                        ⚠️ {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative group overflow-hidden bg-primary/10 text-primary font-rajdhani font-bold text-lg tracking-widest uppercase py-3 rounded border border-primary/50 hover:bg-primary hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                    {loading ? "Loading..." : "Sign in with Email"}
                </button>
            </form>

            <div className="w-full flex items-center gap-4 my-6 text-xs text-gray-500 font-rajdhani font-bold uppercase tracking-widest">
                <div className="h-px bg-gray-800 flex-1"></div>
                <span>OR</span>
                <div className="h-px bg-gray-800 flex-1"></div>
            </div>

            <button
                onClick={() => signIn("github", { callbackUrl })}
                className="w-full flex items-center justify-center gap-3 bg-[#24292e]/60 hover:bg-[#24292e] border border-gray-700 hover:border-gray-500 text-white px-6 py-3 rounded font-rajdhani font-bold text-lg tracking-widest uppercase transition-all duration-300"
            >
                <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
                Continue with GitHub
            </button>

            <p className="text-center text-sm text-gray-400 mt-8">
                Don't have an account?<Link href="/register" className="text-accent hover:text-accent/80 font-semibold hover:underline transition-colors"> Sign up here</Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-[80vh] py-12 px-4 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
            <div className="absolute top-1/3 left-1/3 w-75 h-75 bg-tertiary/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
            
            <Suspense fallback={<div className="text-primary font-rajdhani text-2xl uppercase tracking-widest animate-pulse">Connecting...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}