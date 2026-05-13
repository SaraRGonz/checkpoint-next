import { db } from '@/lib/db';
import { WishlistClient } from '@/components/wishlist/WishlistClient';

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
    const wishlistGames = await db.game.findMany({
        where: { status: 'WISHLIST' },
        include: { platform: true, genres: true },
        orderBy: { addedAt: 'desc' }
    });

    const formattedGames = wishlistGames.map(game => ({
        ...game,
        status: 'Wishlist' as any,
        platform: game.platform?.name || '',
        genres: game.genres.map(g => g.name) || []
    }));

    return <WishlistClient initialGames={formattedGames as any} />;
}