import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from '@/lib/db';
import { WishlistClient } from '@/components/wishlist/WishlistClient';

export const dynamic = 'force-dynamic';

export default async function WishlistPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    const wishlistGames = await db.game.findMany({
        where: { status: 'WISHLIST', userId: session.user.id },
        include: { platform: true, genres: true },
        orderBy: { addedAt: 'desc' }
    });

    const formattedGames = wishlistGames.map((game: any) => ({
        ...game,
        status: 'Wishlist' as any,
        platform: game.platform?.name || '',
        genres: game.genres.map((g: { name: string }) => g.name) || []
    }));

    return <WishlistClient initialGames={formattedGames as any} />;
}