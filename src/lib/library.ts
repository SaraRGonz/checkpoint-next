import { v4 as uuidv4 } from 'uuid';
import type { Game, GameStatus } from '@/types/game';
import seedData from '../data/library.json';
let memoryCache: Game[] | null = null;

function getCache(): Game[] {
    if (memoryCache === null) {
        memoryCache = (seedData as Game[]).map((g) => ({ ...g }));
    }
    return memoryCache;
}

async function writeCache(games: Game[]): Promise<void> {
    memoryCache = games;

    try {
        const fs = await import('fs/promises');
        const path = await import('path');
        const dataPath = path.join(process.cwd(), 'src', 'data', 'library.json');
        await fs.writeFile(dataPath, JSON.stringify(games, null, 2), 'utf-8');
    } catch {
        console.warn(
            '⚠️  FS write omitted (read-only). Los datos se guardan solo en memoria para esta instancia.'
        );
    }
}

// CRUD público 

export async function getAllGames(): Promise<Game[]> {
    return getCache();
}

export async function getGameById(id: string): Promise<Game | null> {
    const games = getCache();
    return games.find((g) => g.id === id) ?? null;
}

export async function addGame(gameData: Omit<Game, 'id'>): Promise<Game> {
    const games = getCache();
    const newGame: Game = {
        ...gameData,
        id: uuidv4(),
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    games.push(newGame);
    await writeCache(games);
    return newGame;
}

export async function updateGame(
    id: string,
    updates: Partial<Game>
): Promise<Game | null> {
    const games = getCache();
    const index = games.findIndex((g) => g.id === id);
    if (index === -1) return null;

    games[index] = {
        ...games[index],
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    await writeCache(games);
    return games[index];
}

export async function deleteGame(id: string): Promise<boolean> {
    const games = getCache();
    const filtered = games.filter((g) => g.id !== id);
    if (filtered.length === games.length) return false;

    await writeCache(filtered);
    return true;
}

// helpers para homepage y sitemap

export async function getRecentGames(limit: number): Promise<Game[]> {
    const games = getCache();
    return [...games]
        .sort((a, b) => {
            const dateA = a.addedAt ? new Date(a.addedAt).getTime() : 0;
            const dateB = b.addedAt ? new Date(b.addedAt).getTime() : 0;
            return dateB - dateA;
        })
        .slice(0, limit);
}

export async function getGamesByStatus(status: GameStatus): Promise<Game[]> {
    const games = getCache();
    return games.filter((g) => g.status === status);
}

export async function getLibraryStats(): Promise<Record<GameStatus, number>> {
    const games = getCache();
    const stats: Record<GameStatus, number> = {
        Wishlist: 0,
        Queue: 0,
        Playing: 0,
        Completed: 0,
        Dropped: 0,
    };
    for (const game of games) {
        if (stats[game.status] !== undefined) {
            stats[game.status]++;
        }
    }
    return stats;
}