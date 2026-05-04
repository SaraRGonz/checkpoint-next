import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function GameNotFound() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
            
            <h1 className="text-9xl font-extrabold text-primary mb-4">404</h1>
            
            <h2 className="text-3xl font-bold text-text mb-6">
                Game Not Found.
            </h2>
            
            <p className="text-gray-400 max-w-md mb-10 mx-auto">
                This game is no longer in your library, never was, or perhaps it was just a dream.
            </p>
            
            <Link href="/library">
                <Button variant="primary">
                    Back to Library
                </Button>
            </Link>
        </div>
    );
}