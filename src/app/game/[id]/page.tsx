import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GameDetailClient } from '../../../components/game/GameDetailClient';
import { db } from '../../../lib/db';

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const game = await db.game.findUnique({ where: { id } });
    
    if (!game) return { title: 'Game Not Found' };
    
    return {
        title: game.title, 
        description: `${game.title} en Checkpoint`,
        openGraph: {
            title: game.title,
            images: game.coverUrl ? [{ url: game.coverUrl }] : [],
        },
    };
}

export default async function GamePage({ params }: Props) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const { id } = await params;
    
    const game = await db.game.findFirst({
        where: { id, userId: session.user.id },
        include: { 
            platform: true, 
            genres: true,
            playthroughs: true 
        }
    });

    if (!game) notFound();

    const formattedGame = {
        ...game,
        platform: game.platform?.name || '',
        genres: game.genres.map((g: { name: string }) => g.name),
        review: game.review || ''
    };

    return <GameDetailClient initialGame={formattedGame as any} />;
}