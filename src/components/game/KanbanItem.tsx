'use client'

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useRouter } from 'next/navigation';
import { GameCard } from './GameCard';
import type { Game } from '@/types/game';

interface Props {
    game: Game;
}

export function KanbanItem({ game }: Props) {
    const router = useRouter();
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: game.id,
        data: { game }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0 : 1, 
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...listeners} 
            {...attributes} 
            className="touch-none outline-none cursor-grab active:cursor-grabbing"
        >
            <GameCard 
                game={game} 
                hideBadge={true} 
                disableLink={true} 
                compact={true}
                onClick={() => router.push(`/game/${game.id}`)} 
            />
        </div>
    );
}