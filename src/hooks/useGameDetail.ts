'use client'

import { useState, useEffect } from 'react';
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

    useEffect(() => {
        if (originalGame) setDraft(originalGame);
    }, [originalGame]);

    const toggleEdit = () => setIsEditing(!isEditing);

    const updateDraftField = (field: keyof Game, value: any) => {
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