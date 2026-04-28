export interface RawgSearchResult {
    rawgId: number;
    title: string;
    coverUrl: string;
    releaseYear?: number;
    genres: string[];
    platforms?: string[];
}

export interface SearchResponse {
    results: RawgSearchResult[];
    count: number;
    next?: string;
}

export interface RawgGameDetails extends RawgSearchResult {
    description: string;
}