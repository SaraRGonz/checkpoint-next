import { Skeleton } from "@/components/ui/Skeleton";

interface GameCardSkeletonProps {
    compact?: boolean;
}

export function GameCardSkeleton({ compact = false }: GameCardSkeletonProps) {
    if (compact) {
        return (
            <div className="flex flex-row h-20 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <Skeleton className="w-14 sm:w-16 h-full rounded-none" />
                <div className="flex flex-col grow justify-center p-3 gap-2">
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex items-center justify-between mt-1">
                        <Skeleton className="h-3 w-1/3" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <Skeleton className="aspect-3/4 w-full rounded-none" />
            <div className="flex flex-col grow p-5 gap-3">
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-800/50">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
            </div>
        </div>
    );
}