import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Game, GameStatus } from '@/types/game';

// ruta absoluta al archivo JSON en Next.js
const dataPath = path.join(process.cwd(), 'src', 'data', 'library.json');

// FUNCIONES INTERNAS 

const readLibrary = async (): Promise<Game[]> => {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeLibrary = async (games: Game[]): Promise<void> => {
    await fs.writeFile(dataPath, JSON.stringify(games, null, 2), 'utf-8');
};

// FUNCIONES EXPORTADAS (CRUD)

export const getAllGames = async (): Promise<Game[]> => {
    return await readLibrary();
};

export const getGameById = async (id: string): Promise<Game | null> => {
    const games = await readLibrary();
    const game = games.find(g => g.id === id);
    return game || null;
};

export const addGame = async (gameData: Omit<Game, 'id'>): Promise<Game> => {
    const games = await readLibrary();
    
    const newGame: Game = {
        ...gameData,
        id: uuidv4(),
        addedAt: new Date().toISOString()
    };
    
    games.push(newGame);
    await writeLibrary(games);
    return newGame;
};

export const updateGame = async (id: string, updates: Partial<Game>): Promise<Game | null> => {
    const games = await readLibrary();
    const index = games.findIndex(g => g.id === id);
    
    if (index === -1) return null;

    games[index] = { 
        ...games[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
    };
    
    await writeLibrary(games);
    return games[index];
};

export const deleteGame = async (id: string): Promise<boolean> => {
    const games = await readLibrary();
    const filteredGames = games.filter(g => g.id !== id);
    
    if (games.length === filteredGames.length) return false;
    
    await writeLibrary(filteredGames);
    return true;
};

// FUNCIONES AUXILIARES PARA LA HOMEPAGE

export const getRecentGames = async (limit: number): Promise<Game[]> => {
    const games = await readLibrary();
    return games
        .sort((a, b) => {
            const dateA = a.addedAt ? new Date(a.addedAt).getTime() : 0;
            const dateB = b.addedAt ? new Date(b.addedAt).getTime() : 0;
            return dateB - dateA;
        })
        .slice(0, limit);
};

export const getGamesByStatus = async (status: GameStatus): Promise<Game[]> => {
    const games = await readLibrary();
    return games.filter(g => g.status === status);
};

export const getLibraryStats = async (): Promise<Record<GameStatus, number>> => {
    const games = await readLibrary();
    
    const stats: Record<GameStatus, number> = {
        Wishlist: 0,
        Queue: 0,
        Playing: 0,
        Completed: 0,
        Dropped: 0
    };
    
    games.forEach(game => {
        if (stats[game.status] !== undefined) {
            stats[game.status]++;
        }
    });
    
    return stats;
};