import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchApi } from './client';

describe('fetchApi', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns data on successful response', async () => {
        const mockData = { id: 1, title: 'Game' };
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => mockData,
        } as unknown as Response);

        const result = await fetchApi('/library');
        expect(result).toEqual(mockData);
    });

    it('returns empty object on 204 response', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            status: 204,
            json: async () => { throw new Error('no body'); },
        } as unknown as Response);

        const result = await fetchApi('/library/1');
        expect(result).toEqual({});
    });

    it('throws with server error message on non-ok non-204 response', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: false,
            status: 400,
            json: async () => ({ error: { message: 'Bad request' } }),
        } as unknown as Response);

        await expect(fetchApi('/library')).rejects.toThrow('Bad request');
    });

    it('throws generic message when error json has no message', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: false,
            status: 500,
            json: async () => ({}),
        } as unknown as Response);

        await expect(fetchApi('/library')).rejects.toThrow('Error en la petición a la API');
    });

    it('throws HTTP error on non-ok 204 response', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: false,
            status: 204,
            json: async () => ({}),
        } as unknown as Response);

        await expect(fetchApi('/library')).rejects.toThrow('Error HTTP: 204');
    });

    it('throws when json parse fails on error response', async () => {
        vi.mocked(fetch).mockResolvedValue({
            ok: false,
            status: 503,
            json: async () => { throw new Error('invalid json'); },
        } as unknown as Response);

        await expect(fetchApi('/library')).rejects.toThrow('Error en la petición a la API');
    });

    it('merges custom headers with Content-Type', async () => {
        const mockData = {};
        vi.mocked(fetch).mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => mockData,
        } as unknown as Response);

        await fetchApi('/library', {
            method: 'POST',
            headers: { Authorization: 'Bearer token' },
        });

        expect(fetch).toHaveBeenCalledWith('/api/library', expect.objectContaining({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer token',
            },
        }));
    });
});