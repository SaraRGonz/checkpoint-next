import type { GameStatus } from './game';

export type PlaythroughStatus = Exclude<GameStatus, 'Wishlist'>;

export interface Playthrough {
    id: string;
    gameId: string;
    platformId?: string | null;
    platform?: { id: string; name: string } | null;
    platformName?: string | null; 
    status: PlaythroughStatus;
    rating?: number | null;
    notes?: string | null;
    characterName?: string | null;
    serverName?: string | null;
    startDate: string;
    endDate?: string | null;
}