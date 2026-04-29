import { Suspense } from 'react';
import { getGamesByStatus, getLibraryStats } from '@/lib/library';
import { HomeColumn } from '@/components/home/HomeColumn';
import { HomeGameItem } from '@/components/home/HomeGameItem';
import { HomeStats } from '@/components/home/HomeStats';

// revalida la caché en el servidor cada 60 segundos
export const revalidate = 60; 

async function PlayingSection() {
    const playingGames = await getGamesByStatus('Playing');
    
    const topPlaying = playingGames
        .sort((a, b) => {
            const lastA = Math.max(new Date(a.updatedAt || 0).getTime(), new Date(a.addedAt || 0).getTime());
            const lastB = Math.max(new Date(b.updatedAt || 0).getTime(), new Date(b.addedAt || 0).getTime());
            return lastB - lastA;
        })
        .slice(0, 3);

    if (topPlaying.length === 0) {
        return (
            <div className="h-full border-2 border-dashed border-gray-800 rounded-2xl flex items-center justify-center text-gray-600 uppercase text-xs font-bold min-h-37.5">
                You have no active sessions
            </div>
        );
    }

    return <>{topPlaying.map(game => <HomeGameItem key={game.id} game={game} />)}</>;
}

async function WishlistSection() {
    const wishlistGames = await getGamesByStatus('Wishlist');
    
    const topWishlist = wishlistGames
        .sort((a, b) => new Date(b.addedAt || 0).getTime() - new Date(a.addedAt || 0).getTime())
        .slice(0, 3);

    if (topWishlist.length === 0) {
        return (
            <div className="h-full border-2 border-dashed border-gray-800 rounded-2xl flex items-center justify-center text-gray-600 uppercase text-xs font-bold min-h-37.5">
                Scanner empty
            </div>
        );
    }

    return <>{topWishlist.map(game => <HomeGameItem key={game.id} game={game} />)}</>;
}

async function StatsSection() {
    const rawStats = await getLibraryStats();
    
    const totalGames = 
        (rawStats['Playing'] || 0) + 
        (rawStats['Queue'] || 0) + 
        (rawStats['Completed'] || 0) + 
        (rawStats['Dropped'] || 0);

    const statuses: ('Playing' | 'Queue' | 'Completed' | 'Dropped')[] = ['Playing', 'Queue', 'Completed', 'Dropped'];

    const statsArray = statuses.map(status => {
        const count = rawStats[status] || 0;
        const percentage = totalGames === 0 ? 0 : Math.round((count / totalGames) * 100);
        return { status, percentage };
    });

    return <HomeStats total={totalGames} stats={statsArray} />;
}

function ColumnSkeleton() {
    return (
        <div className="flex flex-col gap-4 w-full animate-pulse">
            <div className="h-40 bg-gray-800 rounded-2xl"></div>
            <div className="h-40 bg-gray-800 rounded-2xl"></div>
        </div>
    );
}

export default function Home() {
    return (
        <div className="max-w-7xl mx-auto py-10 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-stretch">
                
                <HomeColumn title="Playing">
                    <Suspense fallback={<ColumnSkeleton />}>
                        <PlayingSection />
                    </Suspense>
                </HomeColumn>

                <HomeColumn title="Wishlist">
                    <Suspense fallback={<ColumnSkeleton />}>
                        <WishlistSection />
                    </Suspense>
                </HomeColumn>

                <HomeColumn title="Game Stats">
                    <Suspense fallback={<ColumnSkeleton />}>
                        <StatsSection />
                    </Suspense>
                </HomeColumn>
                
            </div>
        </div>
    );
}