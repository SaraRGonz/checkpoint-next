// define los 5 estados posibles 
export type GameStatus = 'Wishlist' | 'Queue' | 'Playing' | 'Completed' | 'Dropped';

export interface Game {
    id: string;
    rawgId?: number; 
    title: string;
    coverUrl: string;
    coverPosition?: string;
    platform?: string;
    availablePlatforms?: string[]; 
    status: GameStatus; 
    rating?: number;
    review?: string;
    genres?: string[];
    releaseYear?: number;
    addedAt?: string;
    updatedAt?: string;
}