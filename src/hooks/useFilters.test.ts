import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFilters } from './useFilters';
import { useUIStore } from '@/stores/ui-store';
import type { Game } from '@/types/game';

let mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
    useSearchParams: () => mockSearchParams, 
    useRouter: () => ({ replace: vi.fn() }),
    usePathname: () => '/library'
}));

const mockGames = [
    { id: '1', title: 'Zelda', status: 'Playing', genres: ['RPG'], addedAt: '2026-01-01' },
    { id: '2', title: 'Doom', status: 'Queue', genres: ['Shooter'], addedAt: '2026-01-02' }
] as Game[];

describe('useFilters', () => {
    beforeEach(() => {
        mockSearchParams = new URLSearchParams(); 
        useUIStore.getState().clearFilters(); 
    });

    it('return all games -> default state', () => {
        const { result } = renderHook(() => useFilters(mockGames));
        expect(result.current.filteredGames.length).toBe(2);
    });

    it('filter by genre -> "RPG"', () => {
        mockSearchParams = new URLSearchParams({ genre: 'RPG' });
        const { result } = renderHook(() => useFilters(mockGames));
        
        expect(result.current.filteredGames.length).toBe(1);
        expect(result.current.filteredGames[0].title).toBe('Zelda');
    });

    it('filter by status -> "Queue"', () => {
        mockSearchParams = new URLSearchParams({ status: 'Queue' });
        const { result } = renderHook(() => useFilters(mockGames));
        
        expect(result.current.filteredGames.length).toBe(1);
        expect(result.current.filteredGames[0].title).toBe('Doom');
    });
});