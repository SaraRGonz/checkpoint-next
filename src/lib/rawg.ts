import type { RawgSearchResult, RawgGameDetails } from '@/types/rawg';

const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_BASE_URL = 'https://api.rawg.io/api';

interface RawgApiGenre {
    name: string;
}

interface RawgApiPlatform {
    platform: {
        name: string;
    };
}

interface RawgApiGame {
    id: number;
    name: string;
    background_image: string;
    released?: string | null;
    genres?: RawgApiGenre[];
    platforms?: RawgApiPlatform[];
    description_raw?: string;
}

interface RawgApiSearchResponse {
    results: RawgApiGame[];
}

export const searchRawgGames = async (
    query: string,
    platform?: string,
    genre?: string,
    year?: string
): Promise<RawgSearchResult[]> => {
    if (!RAWG_API_KEY) {
        throw new Error('No se ha configurado RAWG_API_KEY en las variables de entorno');
    }

    let url = `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(query)}&page_size=30`;
    
    if (platform) url += `&platforms=${platform}`;
    if (genre) url += `&genres=${genre}`;
    if (year) url += `&dates=${year}-01-01,${year}-12-31`;

    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Error fetching data from RAWG API: ${response.status} ${response.statusText}`);
    }
    
    const data = (await response.json()) as RawgApiSearchResponse;
    
    return data.results.map((game) => ({
        rawgId: game.id,
        title: game.name,
        coverUrl: game.background_image,
        releaseYear: game.released ? parseInt(game.released.split('-')[0]) : undefined,
        genres: game.genres ? game.genres.map((g) => g.name) : [],
        platforms: game.platforms ? game.platforms.map((p) => p.platform.name) : []
    }));
};

export const getRawgGameDetails = async (rawgId: string): Promise<RawgGameDetails> => {
    if (!RAWG_API_KEY) {
        throw new Error('No se ha configurado RAWG_API_KEY en las variables de entorno');
    }

    const response = await fetch(`${RAWG_BASE_URL}/games/${rawgId}?key=${RAWG_API_KEY}`);
    
    if (!response.ok) {
        throw new Error(`Error fetching game details from RAWG API: ${response.status} ${response.statusText}`);
    }
    
    const data = (await response.json()) as RawgApiGame;
    
    return {
        rawgId: data.id,
        title: data.name,
        coverUrl: data.background_image,
        releaseYear: data.released ? parseInt(data.released.split('-')[0]) : undefined,
        genres: data.genres ? data.genres.map((g) => g.name) : [],
        description: data.description_raw || '',
        platforms: data.platforms ? data.platforms.map((p) => p.platform.name) : []
    };
};