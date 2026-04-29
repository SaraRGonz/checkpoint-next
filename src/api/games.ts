import { fetchApi } from '@/api/client';
import type { SearchResponse } from '@/types/rawg';

interface SearchFilters {
    platform?: string;
    genre?: string;
    year?: string;
}

export const searchGamesInRawg = (query: string, filters?: SearchFilters) => {
    const params = new URLSearchParams({ q: query });
    
    if (filters?.platform) params.append('platform', filters.platform);
    if (filters?.genre) params.append('genre', filters.genre);
    if (filters?.year) params.append('year', filters.year);

    return fetchApi<SearchResponse>(`/games/search?${params.toString()}`);
};

export const getRawgGameDetails = (id: string) => {
    return fetchApi(`/games/${id}`);
};