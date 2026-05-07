"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, User } from "lucide-react";

export function UserMenu() {
    const { data: session, status } = useSession();

    // Cargando (Skeleton)
    // Loading (Skeleton)
    if (status === "loading") {
        return <div className="h-9 w-9 animate-pulse bg-border rounded-full"></div>;
    }

    // No autenticado (Botón de login)
    // Unauthenticated (Login button)
    if (!session) {
        return (
            <Link 
                href="/login" 
                className="bg-primarybutton-bg hover:bg-primarybutton-bghover text-white px-4 py-2 rounded-md font-semibold transition-colors text-sm"
            >
                Log In
            </Link>
        );
    }

    // Autenticado (Avatar + Logout)
    // Authenticated (Avatar + Logout)
    return (
        <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                {session.user?.image ? (
                    <img 
                        src={session.user.image} 
                        alt="Avatar" 
                        className="h-9 w-9 rounded-full border-2 border-primary" 
                    />
                ) : (
                    <div className="h-9 w-9 rounded-full bg-primarybutton-bg flex items-center justify-center text-white font-bold">
                        {session.user?.email?.[0].toUpperCase() || <User size={16} />}
                    </div>
                )}
                <span className="hidden md:block text-sm font-medium text-text">
                    {session.user?.name || session.user?.email?.split('@')[0]}
                </span>
            </Link>
            
            <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-text/70 hover:text-red-500 transition-colors flex items-center justify-center p-2 rounded-md hover:bg-red-500/10"
                title="Log out"
            >
                <LogOut size={18} />
            </button>
        </div>
    );
}