export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-background border-t border-gray-800 py-6 mt-auto">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                <p>
                    Powered by{' '}
                    <a 
                        href="https://rawg.io/apidocs" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:underline"
                    >
                        RAWG API
                    </a>
                </p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    {/* suppressHydrationWarning hace que xext.js no se queje si el año del servidor no coincide con el del cliente por zonas horarias */}
                    <p>&copy; <span suppressHydrationWarning>{currentYear}</span> Checkpoint. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}