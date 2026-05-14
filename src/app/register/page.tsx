"use client";

import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { LogoIcon } from "@/components/ui/Icons";
import { signIn, useSession } from "next-auth/react";

export default function RegisterPage() {
    const { status } = useSession();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === "authenticated") {
            window.location.href = "/";
        }
    }, [status]);

    const handleRegister = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        
        if (!email) {
            return setError("Identity required. Please enter your Email.");
        }
        if (!password) {
            return setError("Password missing. Access denied.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return setError("Invalid email format.");
        }
        
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            return setError("Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.");
        }

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);

            const loginResult = await signIn("credentials", {
                email,
                password,
                redirect: false, 
            });

            if (loginResult?.error) {
                // Si falla el login automático, le mandamos al login para que lo intente manual
                window.location.href = "/login?registered=true&error=session_failed";
            } else {
                // Hard navigation directo al home tras registro exitoso
                window.location.href = "/";
            }
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (status === "authenticated") {
        return <div className="flex justify-center items-center h-[80vh] text-primary font-rajdhani text-2xl uppercase tracking-widest animate-pulse">Redirecting...</div>;
    }

    return (
        <div className="relative flex flex-col items-center justify-center min-h-[80vh] py-12 px-4 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-accent/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
            <div className="absolute bottom-1/3 right-1/3 w-75 h-75 bg-tertiary/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

            <div className="relative w-full max-w-md p-8 bg-gray-900/60 backdrop-blur-xl border border-gray-800 shadow-2xl overflow-hidden rounded-xl z-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-accent via-tertiary to-primary"></div>

                <div className="flex flex-col items-center mb-8 space-y-3">
                    <div className="text-primary animate-pulse duration-3000">
                        <LogoIcon className="w-15 h-15" />
                    </div>
                    <h1 className="text-4xl font-rajdhani font-bold uppercase tracking-widest text-text">
                        Sign Up
                    </h1>
                    <p className="text-gray-400 text-sm font-medium text-center">
                        Create your account on Checkpoint.
                    </p>
                </div>

                <form onSubmit={handleRegister} noValidate className="w-full flex flex-col gap-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-rajdhani font-bold uppercase tracking-widest text-gray-400">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@mail.com"
                            className="w-full bg-black/50 border border-gray-800 rounded px-4 py-3 text-text placeholder:text-gray-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all duration-300"
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-rajdhani font-bold uppercase tracking-widest text-gray-400">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min 8 chars, 1 uppercase, 1 number"
                            className="w-full bg-black/50 border border-gray-800 rounded px-4 py-3 text-text placeholder:text-gray-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all duration-300"
                            required
                        />
                    </div>
                    
                    {error && (
                        <p className="text-danger text-sm text-center font-semibold bg-danger/10 py-2 border border-danger/20 rounded">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full relative group overflow-hidden bg-accent/10 text-accent font-rajdhani font-bold text-lg tracking-widest uppercase py-3 rounded border border-accent/50 hover:bg-accent hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? "Registering..." : "Create account"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-8">
                    Already have an account? <Link href="/login" className="text-primary hover:text-primary/80 font-semibold hover:underline transition-colors">Sign in</Link>
                </p>
            </div>
        </div>
    );
}