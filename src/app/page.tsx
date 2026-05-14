import { Suspense } from 'react';
import { db } from '@/lib/db';
import { HomeColumn } from '@/components/home/HomeColumn';
import { HomeGameItem } from '@/components/home/HomeGameItem';
import { HomeStats } from '@/components/home/HomeStats';
import { GameCardSkeleton } from '@/components/ui/GameCardSkeleton';

export const dynamic = 'force-dynamic';

async function PlayingSection() {
    const playingGames = await db.game.findMany({
        where: { status: 'PLAYING' },
        include: { platform: true, genres: true },
        orderBy: { updatedAt: 'desc' },
        take: 3
    });

    if (playingGames.length === 0) {
        return (
            <div className="h-full border-2 border-dashed border-gray-800 rounded-2xl flex items-center justify-center text-gray-600 uppercase text-xs font-bold min-h-37.5">
                You have no active sessions
            </div>
        );
    }

    const formattedGames = playingGames.map((game: any) => ({
        ...game,
        status: 'Playing' as any,
        platform: game.platform?.name || '',
        genres: game.genres.map((g: { name: string }) => g.name) || []
    }));

    return <>{formattedGames.map((game: any) => <HomeGameItem key={game.id} game={game as any} />)}</>;
}

async function WishlistSection() {
    const wishlistGames = await db.game.findMany({
        where: { status: 'WISHLIST' },
        include: { platform: true, genres: true },
        orderBy: { addedAt: 'desc' },
        take: 3
    });

    if (wishlistGames.length === 0) {
        return (
            <div className="h-full border-2 border-dashed border-gray-800 rounded-2xl flex items-center justify-center text-gray-600 uppercase text-xs font-bold min-h-37.5">
                Scanner empty
            </div>
        );
    }

    const formattedGames = wishlistGames.map((game: any) => ({
        ...game,
        status: 'Wishlist' as any,
        platform: game.platform?.name || '',
        genres: game.genres.map((g: { name: string }) => g.name) || []
    }));

    return <>{formattedGames.map((game: any) => <HomeGameItem key={game.id} game={game as any} />)}</>;
}

async function StatsSection() {
    const nonWishlistGames = await db.game.findMany({
        where: {
            status: { in: ['PLAYING', 'QUEUE', 'COMPLETED', 'DROPPED'] }
        }
    });

    const totalGames = nonWishlistGames.length;

    const rawStats = nonWishlistGames.reduce((acc: Record<string, number>, game: any) => {
        const statusStr = game.status.charAt(0) + game.status.slice(1).toLowerCase();
        acc[statusStr] = (acc[statusStr] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const statuses: ('Playing' | 'Queue' | 'Completed' | 'Dropped')[] = ['Playing', 'Queue', 'Completed', 'Dropped'];

    const statsArray = statuses.map(status => {
        const count = rawStats[status] || 0;
        const percentage = totalGames === 0 ? 0 : Math.round((count / totalGames) * 100);
        return { status, percentage };
    });

    return <HomeStats total={totalGames} stats={statsArray} />;
}

// SKELETONS HOME 

function HomeColumnSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="flex flex-col gap-4 w-full">
            {Array.from({ length: count }).map((_, i) => (
                <GameCardSkeleton key={i} compact />
            ))}
        </div>
    );
}

function StatsSkeleton() {
    return (
        <div className="h-full flex flex-col justify-center gap-8 animate-pulse">
            <div className="text-center border-b border-gray-800 pb-6">
                <div className="h-12 w-24 bg-gray-800 mx-auto rounded-md mb-3"></div>
                <div className="h-3 w-32 bg-gray-800 mx-auto rounded-md"></div>
            </div>
            <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex justify-between">
                            <div className="h-3 w-16 bg-gray-800 rounded-md"></div>
                            <div className="h-3 w-8 bg-gray-800 rounded-md"></div>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Home() {
    return (
        <div className="max-w-7xl mx-auto py-10 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-stretch">
                
                <HomeColumn title="Playing">
                    <Suspense fallback={<HomeColumnSkeleton />}>
                        <PlayingSection />
                    </Suspense>
                </HomeColumn>

                <HomeColumn title="Wishlist">
                    <Suspense fallback={<HomeColumnSkeleton />}>
                        <WishlistSection />
                    </Suspense>
                </HomeColumn>

                <HomeColumn title="Game Stats">
                    <Suspense fallback={<StatsSkeleton />}>
                        <StatsSection />
                    </Suspense>
                </HomeColumn>
                
            </div>
        </div>
    );
}