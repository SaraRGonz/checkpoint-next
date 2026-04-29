'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from '@/context/ThemeContext'
import { LibraryProvider } from '@/context/LibraryContext'

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <LibraryProvider>
                {children}
            </LibraryProvider>
        </ThemeProvider>
    )
}