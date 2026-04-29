'use client'

import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Game } from '@/types/game';
import * as libraryApi from '@/api/library';

interface LibraryContextType {
    games: Game[];
    addGame: (game: Omit<Game, 'id'>) => Promise<string>; 
    updateGame: (id: string, updates: Partial<Game>) => Promise<void>;
    deleteGame: (id: string) => Promise<void>;
    isLoading: boolean;
    error: string | null; 
}

export const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: ReactNode }) {
    const [games, setGames] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadGames = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const result = await libraryApi.getLibrary();
                setGames(result.data);
            } catch (err: any) {
                setError(err.message || 'Error al cargar la biblioteca desde el servidor');
            } finally {
                setIsLoading(false);
            }
        };

        loadGames();
    }, []); 

    const addGame = async (newGameData: Omit<Game, 'id'>) => {
        try {
            setError(null);
            const newGame = await libraryApi.addGameToLibrary(newGameData);
            setGames((prevGames) => [...prevGames, newGame]);
            return newGame.id;
        } catch (err: any) {
            setError(err.message || 'Error al añadir el juego');
            throw err; 
        } 
    };

    const updateGame = async (id: string, updates: Partial<Game>) => {
        const previousGames = [...games];
        try {
            setError(null);
            setGames((prevGames) => 
                prevGames.map(game => game.id === id ? { ...game, ...updates } : game)
            );
            const updatedGame = await libraryApi.updateGameInLibrary(id, updates);
            setGames((prevGames) => 
                prevGames.map(game => game.id === id ? updatedGame : game)
            );
        } catch (err: any) {
            setGames(previousGames);
            setError(err.message || 'Error al actualizar el juego');
            throw err;
        }
    };

    const deleteGame = async (id: string) => {
        try {
            setError(null);
            await libraryApi.deleteGameFromLibrary(id);
            setGames((prevGames) => prevGames.filter(game => game.id !== id));
        } catch (err: any) {
            setError(err.message || 'Error al borrar el juego');
            throw err;
        } 
    };

    return (
        <LibraryContext.Provider value={{ games, addGame, updateGame, deleteGame, isLoading, error }}>
            {children}
        </LibraryContext.Provider>
    );
}