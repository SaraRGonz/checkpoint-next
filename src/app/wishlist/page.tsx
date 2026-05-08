import { getGamesByStatus } from '@/lib/library';
import { WishlistClient } from '@/components/wishlist/WishlistClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function WishlistPage() {
    const wishlistGames = await getGamesByStatus('Wishlist');
    return <WishlistClient initialGames={wishlistGames} />;
}