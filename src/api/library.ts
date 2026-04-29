import { fetchApi } from '@/api/client';
import type { Game } from '@/types/game';

export const getLibrary = () => {
    return fetchApi<{ data: Game[] }>('/library');
};

export const addGameToLibrary = (gameData: Omit<Game, 'id'>) => {
    return fetchApi<Game>('/library', {
        method: 'POST',
        body: JSON.stringify(gameData)
    });
};

export const updateGameInLibrary = (id: string, updates: Partial<Game>) => {
    return fetchApi<Game>(`/library/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
    });
};

export const deleteGameFromLibrary = (id: string) => {
    return fetchApi(`/library/${id}`, { 
        method: 'DELETE' 
    });
};