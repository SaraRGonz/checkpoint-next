import { getGamesByStatus } from '@/lib/library';
import { WishlistClient } from '@/components/wishlist/WishlistClient';

export default async function WishlistPage() {

    const wishlistGames = await getGamesByStatus('Wishlist');

    return <WishlistClient initialGames={wishlistGames} />;
}