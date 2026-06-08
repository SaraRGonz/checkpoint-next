'use client'

import { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { STATUS_LIST } from '@/utils/constants';
import { KanbanColumn } from './KanbanColumn';
import { KanbanItem } from './KanbanItem';
import { GameCard } from './GameCard';
import { useGames } from '@/hooks/use-games';
import type { Game } from '@/types/game';

interface Props {
    games: Game[];
}

export function KanbanBoard({ games }: Props) {
    const { updateGame } = useGames();
    const [activeGame, setActiveGame] = useState<Game | null>(null);
    const [pendingMove, setPendingMove] = useState<{ id: string; status: Game['status'] } | null>(null);

    const columns = STATUS_LIST.filter(s => s.value !== 'Wishlist');

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
    );

    const displayGames = pendingMove
        ? games.map(g => g.id === pendingMove.id ? { ...g, status: pendingMove.status } : g)
        : games;

    const handleDragStart = (event: DragStartEvent) => {
        const game = games.find(g => g.id === event.active.id);
        if (game) setActiveGame(game);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over) {
            const gameId = active.id as string;
            const newStatus = over.id as Game['status'];
            const draggedGame = games.find(g => g.id === gameId);

            if (draggedGame && draggedGame.status !== newStatus) {
                setPendingMove({ id: gameId, status: newStatus }); 
                updateGame(gameId, { status: newStatus });          
            }
        }

        setActiveGame(null);
    };

    const prevGames = games;
    if (pendingMove && games.find(g => g.id === pendingMove.id)?.status === pendingMove.status) {
        setPendingMove(null);
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={() => { setActiveGame(null); setPendingMove(null); }}
        >
            <div className="flex gap-6 overflow-x-auto pb-6 snap-x w-full">
                {columns.map(col => {
                    const columnGames = displayGames.filter(g => g.status === col.value);
                    return (
                        <div key={col.value} className="w-71.5 shrink-0 snap-center">
                            <KanbanColumn status={col.value as Game['status']} label={col.label} count={columnGames.length}>
                                {columnGames.map((game) => (
                                    <KanbanItem key={game.id} game={game} />
                                ))}
                            </KanbanColumn>
                        </div>
                    );
                })}
            </div>
            <DragOverlay dropAnimation={null}>
                {activeGame ? (
                    <div className="cursor-grabbing rotate-2 shadow-2xl opacity-90">
                        <GameCard game={activeGame} hideBadge={true} disableLink={true} compact={true} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}