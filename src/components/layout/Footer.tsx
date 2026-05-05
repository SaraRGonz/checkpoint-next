export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-background border-t border-gray-800 py-6 mt-auto">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
                <p>
                    Powered by{' '}
                    <a 
                        href="https://rawg.io/apidocs" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="Visit RAWG API Documentation"
                        className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors font-bold"
                    >
                        RAWG API
                    </a>
                </p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <p>&copy; <span suppressHydrationWarning>{currentYear}</span> Checkpoint. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}