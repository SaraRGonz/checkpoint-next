export default function SearchLoading() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
            <header className="bg-gray-900/40 p-6 md:p-8 rounded-2xl border border-gray-800 shadow-2xl flex flex-col gap-6">
                <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-gray-800 rounded-full shrink-0"></div>
                    <div className="space-y-2 w-full">
                        <div className="h-10 bg-gray-800 rounded w-64"></div>
                        <div className="h-5 bg-gray-800 rounded w-96"></div>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="h-12 bg-gray-800 rounded grow"></div>
                        <div className="h-12 bg-gray-800 rounded w-40 shrink-0"></div>
                    </div>
                    <div className="flex gap-4 pt-4 border-t border-gray-800/50">
                        <div className="h-8 bg-gray-800 rounded w-16"></div>
                        <div className="h-8 bg-gray-800 rounded w-48"></div>
                        <div className="h-8 bg-gray-800 rounded w-48"></div>
                    </div>
                </div>
            </header>
        </div>
    );
}