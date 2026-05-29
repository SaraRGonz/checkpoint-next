'use client'

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useGames } from '@/hooks/use-games';
import type { Game } from '@/types/game';

export function useGameDetail(initialGame?: Game) {
    const params = useParams();
    const id = params?.id as string;
    
    const { games, updateGame, isLoading } = useGames();
    
    const storeGame = games.find((g) => g.id === id);
    const originalGame = storeGame || initialGame;

    const [isEditing, setIsEditing] = useState(false);
    
    const [draft, setDraft] = useState<Game | undefined>(originalGame);
    const [prevOriginalGame, setPrevOriginalGame] = useState<Game | undefined>(originalGame);

    if (originalGame !== prevOriginalGame) {
        setPrevOriginalGame(originalGame);
        setDraft(originalGame);
    }

    const toggleEdit = () => setIsEditing(!isEditing);

    const updateDraftField = <K extends keyof Game>(field: K, value: Game[K]) => {
        setDraft(prev => prev ? { ...prev, [field]: value } : undefined);
    };

    const saveChanges = async () => {
        if (draft && originalGame) {
            await updateGame(originalGame.id, { ...draft });
            setIsEditing(false);
        }
    };

    const discardChanges = () => {
        setDraft(originalGame);
        setIsEditing(false);
    };

    return {
        game: originalGame,
        draft,
        isEditing,
        isLoading,
        toggleEdit,
        updateDraftField,
        saveChanges,
        discardChanges
    };
}