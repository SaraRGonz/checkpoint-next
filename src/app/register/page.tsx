"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push("/login?registered=true");
        } catch (err: any) {
            setError(err.message || "Error registering user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
            <div className="bg-card p-8 rounded-lg shadow-lg border border-border w-full max-w-md flex flex-col items-center gap-6">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-rajdhani font-bold">Sign Up</h1>
                    <p className="text-text/80">Create your account on Checkpoint.</p>
                </div>

                <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
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
                        {loading ? "Registering..." : "Create account"}
                    </button>
                </form>

                <p className="text-sm text-text/70 mt-2">
                    Already have an account? <Link href="/login" className="text-accent hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}