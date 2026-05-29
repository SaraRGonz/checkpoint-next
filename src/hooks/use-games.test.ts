import React, { ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGames } from './use-games';
import { useUIStore } from '@/stores/ui-store';

vi.mock('@/api/library', () => ({
    getLibrary: vi.fn().mockResolvedValue({
        data: [
            { id: '1', title: 'Cyberpunk 2077', status: 'Wishlist', genres: [], platform: 'PC' },
            { id: '2', title: 'Hollow Knight', status: 'Playing', genres: [], platform: 'PC' },
        ]
    }),
    updateGameInLibrary: vi.fn().mockResolvedValue({}),
    deleteGameFromLibrary: vi.fn().mockResolvedValue({}),
}));

const makeWrapper = () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { networkMode: 'always' } } });
    return ({ children }: { children: ReactNode }) => React.createElement(QueryClientProvider, { client: qc }, children);
};

beforeEach(() => {
    useUIStore.getState().clearFilters();
});

describe('useGames', () => {
    it('returns games from API', async () => {
        const { result } = renderHook(() => useGames(), { wrapper: makeWrapper() });
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.games).toHaveLength(2);
        expect(result.current.games[0].title).toBe('Cyberpunk 2077');
    });

    it('updateGame calls mutate without throwing', async () => {
        const { result } = renderHook(() => useGames(), { wrapper: makeWrapper() });
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(() => result.current.updateGame('1', { status: 'Playing' })).not.toThrow();
    });

    it('deleteGame calls mutate without throwing', async () => {
        const { result } = renderHook(() => useGames(), { wrapper: makeWrapper() });
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(() => result.current.deleteGame('1')).not.toThrow();
    });

    it('exposes error as null on success', async () => {
        const { result } = renderHook(() => useGames(), { wrapper: makeWrapper() });
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.error).toBeNull();
    });
});