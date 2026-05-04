import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GameDetailClient } from '../../../components/game/GameDetailClient';
import { getGameById } from '../../../lib/library';

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const game = await getGameById(resolvedParams.id);
    
    if (!game) {
        return { title: 'Juego no encontrado | Checkpoint' };
    }
    
    return {
        title: `${game.title} | Checkpoint`,
        description: game.review || `${game.title} — ${game.status} en tu biblioteca de Checkpoint`,
        openGraph: {
            title: game.title,
            images: [{ url: game.coverUrl, width: 600, height: 800, alt: game.title }],
        },
    };
}

export default async function GamePage({ params }: Props) {
    const resolvedParams = await params;
    const game = await getGameById(resolvedParams.id);

    if (!game) {
        notFound();
    }

    return <GameDetailClient game={game} />;
}