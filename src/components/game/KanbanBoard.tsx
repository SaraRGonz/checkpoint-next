'use client'

import { useState } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { STATUS_LIST } from '@/utils/constants';
import { KanbanColumn } from './KanbanColumn';
import { KanbanItem } from './KanbanItem';
import { GameCard } from './GameCard';
import { useLibrary } from '@/hooks/useLibrary';
import type { Game, GameStatus } from '@/types/game';

interface Props {
    games: Game[];
}

export function KanbanBoard({ games }: Props) {
    const { updateGame } = useLibrary();
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;
        if (!over) return;

        const gameId = active.id as string;
        const newStatus = over.id as GameStatus;
        const game = games.find(g => g.id === gameId);
        
        if (game && game.status !== newStatus) {
            await updateGame(gameId, { status: newStatus });
        }
    };

    const columns = STATUS_LIST.filter(s => s.value !== 'Wishlist');
    const activeGame = activeId ? games.find(g => g.id === activeId) : null;

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={() => setActiveId(null)}>
            <div className="flex gap-6 overflow-x-auto pb-6 snap-x w-full">
                {columns.map(col => {
                    const columnGames = games.filter(g => g.status === col.value);
                    return (
                        <div key={col.value} className="w-68 shrink-0 snap-center">
                            <KanbanColumn status={col.value} label={col.label} count={columnGames.length}>
                                {columnGames.map((game, index) => (
                                    <KanbanItem 
                                        key={game.id} 
                                        game={game} 
                                    />
                                ))}
                            </KanbanColumn>
                        </div>
                    );
                })}
            </div>
            <DragOverlay>
                {activeGame ? (
                    <div className="cursor-grabbing rotate-2 shadow-2xl opacity-90">
                        <GameCard game={activeGame} hideBadge={true} disableLink={true} compact={true} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}