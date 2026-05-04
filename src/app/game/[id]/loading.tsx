import { Spinner } from '../../../components/ui/Spinner';

export default function GameDetailLoading() {
    return (
        <div className="max-w-7xl mx-auto space-y-8 p-10 animate-in fade-in duration-300">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-800 pb-6 gap-4">
                <div className="h-10 w-64 bg-gray-800 rounded-lg animate-pulse"></div>
                <div className="flex gap-2">
                    <div className="h-10 w-24 bg-gray-800 rounded-lg animate-pulse"></div>
                    <div className="h-10 w-24 bg-gray-800 rounded-lg animate-pulse"></div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-[600px]">
                {/* Cover Skeleton */}
                <div className="lg:col-span-3 bg-gray-900/40 rounded-2xl border border-gray-800 animate-pulse flex items-center justify-center">
                    <Spinner />
                </div>
                
                {/* Info Skeleton */}
                <div className="lg:col-span-4 bg-gray-900/40 p-6 rounded-2xl border border-gray-800 animate-pulse space-y-6">
                    <div className="h-6 w-full bg-gray-800 rounded"></div>
                    <div className="h-6 w-full bg-gray-800 rounded"></div>
                    <div className="h-6 w-3/4 bg-gray-800 rounded"></div>
                </div>

                {/* Notes Skeleton */}
                <div className="lg:col-span-5 bg-gray-900/40 p-6 rounded-2xl border border-gray-800 animate-pulse">
                    <div className="h-8 w-32 bg-gray-800 rounded mb-4"></div>
                    <div className="h-full w-full bg-gray-800/50 rounded-xl"></div>
                </div>
            </div>
        </div>
    );
}