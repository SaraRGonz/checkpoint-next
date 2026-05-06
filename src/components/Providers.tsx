"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { ThemeProvider } from '@/context/ThemeContext';
import { LibraryProvider } from '@/context/LibraryContext';

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <ThemeProvider>
                <LibraryProvider>
                    {children}
                </LibraryProvider>
            </ThemeProvider>
        </SessionProvider>
    );
}