import { fetchApi } from './client';
import type { Playthrough } from '@/types/playthrough';

export const createPlaythrough = (gameId: string) => fetchApi<Playthrough>(`/games/${gameId}/playthroughs`, { method: 'POST' });
export const updatePlaythrough = (id: string, updates: Partial<Playthrough>) => fetchApi<Playthrough>(`/playthroughs/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
export const deletePlaythrough = (id: string) => fetchApi(`/playthroughs/${id}`, { method: 'DELETE' });