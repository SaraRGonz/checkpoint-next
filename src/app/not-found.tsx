import Link from 'next/link';
import { Button } from '@/components/ui/Button'; 

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
            
            <h1 className="text-9xl font-extrabold text-primary mb-4">404</h1>
            
            <h2 className="text-3xl font-bold text-text mb-6">
                Oops! You've gone off the map.
            </h2>
            
            <p className="text-gray-400 max-w-md mb-10 mx-auto">
                It seems the page you're looking for doesn't exist, has been moved, or is in another dimension.
            </p>
            
            <Link href="/">
                <Button variant="primary">
                    Back to base!
                </Button>
            </Link>
        </div>
    );
}