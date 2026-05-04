import { GameCardSkeleton } from '@/components/ui/GameCardSkeleton';

export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 py-10">
            {/* Header Skeleton */}
            <div className="flex justify-between items-end border-b border-gray-800 pb-6">
                <div className="h-10 w-48 bg-gray-800 rounded-md animate-pulse"></div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                    <GameCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}