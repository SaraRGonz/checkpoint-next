"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, User } from "lucide-react";

export function UserMenu() {
    const { data: session, status } = useSession();

    // Skeleton
    if (status === "loading") {
        return <div className="h-9 w-9 animate-pulse bg-border rounded-full"></div>;
    }

    // Botón login
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

    const position = session.user?.imagePosition || "50% 50%";
    const isValidPosition = /^\d+%\s\d+%$/.test(position);
    const safePosition = isValidPosition ? position : "50% 50%";

    // Avatar + Logout
    return (
        <div className="flex items-center gap-4 w-full justify-between md:justify-start">
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                {session.user?.image ? (
                    <img 
                        src={session.user.image} 
                        alt="Avatar" 
                        className="h-9 w-9 rounded-full border-2 border-primary object-cover" 
                        style={{ objectPosition: safePosition }}
                    />
                ) : (
                    <div className="h-9 w-9 rounded-full bg-primarybutton-bg flex items-center justify-center text-white font-bold">
                        {session.user?.email?.[0].toUpperCase() || <User size={16} />}
                    </div>
                )}
                <span className="block text-sm font-medium text-text truncate max-w-45 md:max-w-37.5">
                    {session.user?.name || "Anonymous_Runner"}
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