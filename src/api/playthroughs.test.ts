import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPlaythrough, updatePlaythrough, deletePlaythrough } from './playthroughs';

beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
});
afterEach(() => {
    vi.restoreAllMocks();
});

const mockFetch = (data: unknown, status = 200) => {
    vi.mocked(fetch).mockResolvedValue({
        ok: true, status,
        json: async () => data,
    } as Response);
};

describe('playthroughs API', () => {
    it('createPlaythrough POSTs to /games/:id/playthroughs', async () => {
        mockFetch({ id: 'p1', status: 'Queue', gameId: 'g1', startDate: '2024-01-01' });
        const result = await createPlaythrough('g1');
        expect(fetch).toHaveBeenCalledWith(
            '/api/games/g1/playthroughs',
            expect.objectContaining({ method: 'POST' })
        );
        expect(result).toMatchObject({ id: 'p1' });
    });

    it('updatePlaythrough PUTs to /playthroughs/:id', async () => {
        mockFetch({ id: 'p1', status: 'Playing', gameId: 'g1', startDate: '2024-01-01' });
        const result = await updatePlaythrough('p1', { status: 'Playing' });
        expect(fetch).toHaveBeenCalledWith(
            '/api/playthroughs/p1',
            expect.objectContaining({ method: 'PUT' })
        );
        expect(result).toMatchObject({ status: 'Playing' });
    });

    it('deletePlaythrough DELETEs /playthroughs/:id', async () => {
        mockFetch({}, 204);
        await deletePlaythrough('p1');
        expect(fetch).toHaveBeenCalledWith(
            '/api/playthroughs/p1',
            expect.objectContaining({ method: 'DELETE' })
        );
    });
});