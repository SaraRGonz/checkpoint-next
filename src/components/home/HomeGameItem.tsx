import Link from 'next/link';
import Image from 'next/image';
import type { Game } from '@/types/game';

interface HomeGameItemProps {
    game: Game;
}

export function HomeGameItem({ game }: HomeGameItemProps) {
    return (
        <Link
            href={`/game/${game.id}`}
            className="relative h-40 rounded-2xl overflow-hidden border border-gray-800 shadow-xl group/item block"
        >
            <Image
                src={game.coverUrl || '/placeholder.jpg'}
                alt={game.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover/item:scale-110"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 p-4 w-full">
                <h3 className="text-text font-bold truncate text-lg uppercase tracking-tight">
                    {game.title}
                </h3>
            </div>
        </Link>
    );
}