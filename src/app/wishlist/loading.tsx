export default function WishlistLoading() {
    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
            {/* Sidebar Skeleton */}
            <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
                <div className="h-10 bg-gray-800 rounded animate-pulse w-full"></div>
                <div className="h-10 bg-gray-800 rounded animate-pulse w-full"></div>
                <div className="h-10 bg-gray-800 rounded animate-pulse w-full mt-4"></div>
            </aside>

            {/* Grid Skeleton */}
            <main className="flex-1 w-full min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex flex-col gap-3 h-full">
                            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                                <div className="aspect-[3/4] w-full bg-gray-800 animate-pulse" />
                                <div className="p-5 space-y-3">
                                    <div className="h-5 bg-gray-800 rounded animate-pulse w-3/4" />
                                </div>
                            </div>
                            <div className="h-10 bg-gray-800 rounded animate-pulse w-full"></div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}