import React, { ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePlaythroughs } from './usePlaythroughs';
import type { Playthrough } from '@/types/playthrough';

const { mockNew } = vi.hoisted(() => ({
    mockNew: {
        id: 'new-p-1', gameId: 'game-1', status: 'Queue', startDate: new Date().toISOString(),
        rating: null, notes: null, characterName: null, serverName: null, platform: null
    } as Playthrough
}));

vi.mock('@/api/playthroughs', () => ({
    createPlaythrough: vi.fn().mockResolvedValue(mockNew),
    updatePlaythrough: vi.fn().mockImplementation((id, data) => Promise.resolve({ ...mockNew, id, ...data })),
    deletePlaythrough: vi.fn().mockResolvedValue(undefined),
}));

const makeWrapper = () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { networkMode: 'always' } } });
    return ({ children }: { children: ReactNode }) => React.createElement(QueryClientProvider, { client: qc }, children);
};

const initialPlaythroughs: Playthrough[] = [
    { 
        id: 'p1', gameId: 'game-1', status: 'Queue', startDate: '2024-01-01',
        rating: null, notes: null, characterName: null, serverName: null, platform: null 
    }
];

describe('usePlaythroughs', () => {
    it('returns normalised playthroughs', () => {
        const { result } = renderHook(
            () => usePlaythroughs(initialPlaythroughs, 'game-1'),
            { wrapper: makeWrapper() }
        );
        expect(result.current.playthroughs).toHaveLength(1);
        expect(result.current.playthroughs[0].status).toBe('Queue');
    });

    it('addPlaythrough adds optimistic entry', async () => {
        const { result } = renderHook(
            () => usePlaythroughs([], 'game-1'),
            { wrapper: makeWrapper() }
        );
        await act(async () => {
            await result.current.addPlaythrough();
        });
        await waitFor(() => {
            expect(result.current.playthroughs).toHaveLength(1);
        });
    });

    it('updatePlaythrough calls mutation', async () => {
        const { result } = renderHook(
            () => usePlaythroughs(initialPlaythroughs, 'game-1'),
            { wrapper: makeWrapper() }
        );
        await act(async () => {
            await result.current.updatePlaythrough('p1', { status: 'Playing' });
        });
        await waitFor(() => {
            expect(result.current.playthroughs[0].status).toBe('Playing');
        });
    });

    it('deletePlaythrough removes entry', async () => {
        const { result } = renderHook(
            () => usePlaythroughs(initialPlaythroughs, 'game-1'),
            { wrapper: makeWrapper() }
        );
        await act(async () => {
            await result.current.deletePlaythrough('p1');
        });
        await waitFor(() => {
            expect(result.current.playthroughs).toHaveLength(0);
        });
    });
});