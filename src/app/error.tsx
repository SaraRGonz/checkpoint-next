'use client'; // Obligatorio para los Error Boundaries en Next.js

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application error captured by Next.js boundary:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
            
            <h1 className="text-9xl font-extrabold text-danger mb-4">500</h1>
            
            <h2 className="text-3xl font-bold text-text mb-6">
                System Malfunction.
            </h2>
            
            <p className="text-gray-400 max-w-md mb-10 mx-auto">
                An unexpected error has occurred. Our cyber-monkeys are working on it.
                <span className="block mt-4 text-xs text-danger/50 font-mono">
                    {error.message || "Unknown rendering error"}
                </span>
            </p>
            
            <Button variant="primary" onClick={() => reset()}>
                Try again
            </Button>
        </div>
    );
}