import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { GET, POST } from './route';
import { db } from '@/lib/db';

vi.mock('@/lib/db', () => ({
    db: {
        game: {
            findMany: vi.fn(),
            create: vi.fn(),
        },
        platform: {
            findUnique: vi.fn(),
            create: vi.fn(),
        },
        genre: {
            findUnique: vi.fn(),
            create: vi.fn(),
        },
    },
}));

vi.mock('next-auth', () => ({
    default: vi.fn(),
    getServerSession: vi.fn(),
}));

vi.mock('@/app/api/auth/[...nextauth]/route', () => ({
    authOptions: {},
}));

import { getServerSession } from 'next-auth';

const authedSession = { user: { id: 'user-1' } };

describe('GET /api/library', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (getServerSession as Mock).mockResolvedValue(authedSession);
    });

    it('returns 401 when no session', async () => {
        (getServerSession as Mock).mockResolvedValue(null);
        const req = new Request('http://localhost/api/library');
        const res = await GET(req);
        expect(res.status).toBe(401);
    });

    it('returns 500 on db error', async () => {
        (db.game.findMany as Mock).mockRejectedValue(new Error('DB fail'));
        const req = new Request('http://localhost/api/library?search=');
        const res = await GET(req);
        expect(res.status).toBe(500);
        const json = await res.json();
        expect(json.error.code).toBe('SERVER_ERROR');
    });

    it('handles game with null platform', async () => {
        (db.game.findMany as Mock).mockResolvedValue([{
            id: '2', title: 'Unknown', status: 'PLAYING',
            platform: null,
            genres: [],
        }]);
        const req = new Request('http://localhost/api/library?search=');
        const res = await GET(req);
        const json = await res.json();
        expect(json.data[0].platform).toBe('Unknown');
    });
});

describe('POST /api/library', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (getServerSession as Mock).mockResolvedValue(authedSession);
    });

    const validBody = {
        title: 'Halo',
        status: 'Wishlist',
        coverUrl: 'https://img.com/halo.jpg',
        platform: 'Xbox',
        genres: ['Shooter', 'Action'],
        rating: 4,
        releaseYear: 2001,
        rawgId: 123,
    };

    const mockPlatform = { id: 'plat-1', name: 'Xbox' };
    const mockGenreShooter = { id: 'g-1', name: 'Shooter' };
    const mockGenreAction = { id: 'g-2', name: 'Action' };
    const mockGame = {
        id: 'game-1',
        title: 'Halo',
        status: 'WISHLIST',
        coverUrl: 'https://img.com/halo.jpg',
        rating: 4,
        releaseYear: 2001,
        rawgId: 123,
        userId: 'user-1',
        platformId: 'plat-1',
        platform: mockPlatform,
        genres: [mockGenreShooter, mockGenreAction],
    };

    it('returns 401 when no session', async () => {
        (getServerSession as Mock).mockResolvedValue(null);
        const req = new Request('http://localhost/api/library', {
            method: 'POST',
            body: JSON.stringify(validBody),
        });
        const res = await POST(req);
        expect(res.status).toBe(401);
    });

    it('creates game with existing platform and genres', async () => {
        (db.platform.findUnique as Mock).mockResolvedValue(mockPlatform);
        (db.genre.findUnique as Mock)
            .mockResolvedValueOnce(mockGenreShooter)
            .mockResolvedValueOnce(mockGenreAction);
        (db.game.create as Mock).mockResolvedValue(mockGame);

        const req = new Request('http://localhost/api/library', {
            method: 'POST',
            body: JSON.stringify(validBody),
        });
        const res = await POST(req);
        expect(res.status).toBe(201);
        const json = await res.json();
        expect(json.title).toBe('Halo');
        expect(json.platform).toBe('Xbox');
        expect(json.genres).toEqual(['Shooter', 'Action']);
        // status formatted: first char upper + rest lower
        expect(json.status).toBe('Wishlist');
    });

    it('creates platform when not found', async () => {
        (db.platform.findUnique as Mock).mockResolvedValue(null);
        (db.platform.create as Mock).mockResolvedValue(mockPlatform);
        (db.genre.findUnique as Mock).mockResolvedValue(mockGenreShooter);
        (db.game.create as Mock).mockResolvedValue({ ...mockGame, genres: [mockGenreShooter] });

        const req = new Request('http://localhost/api/library', {
            method: 'POST',
            body: JSON.stringify({ ...validBody, genres: ['Shooter'] }),
        });
        const res = await POST(req);
        expect(res.status).toBe(201);
        expect(db.platform.create).toHaveBeenCalledWith({ data: { name: 'Xbox' } });
    });

    it('creates genre when not found', async () => {
        (db.platform.findUnique as Mock).mockResolvedValue(mockPlatform);
        (db.genre.findUnique as Mock).mockResolvedValue(null);
        (db.genre.create as Mock).mockResolvedValue(mockGenreShooter);
        (db.game.create as Mock).mockResolvedValue({ ...mockGame, genres: [mockGenreShooter] });

        const req = new Request('http://localhost/api/library', {
            method: 'POST',
            body: JSON.stringify({ ...validBody, genres: ['Shooter'] }),
        });
        const res = await POST(req);
        expect(res.status).toBe(201);
        expect(db.genre.create).toHaveBeenCalledWith({ data: { name: 'Shooter' } });
    });

    it('uses default platform PC when none provided', async () => {
        (db.platform.findUnique as Mock).mockResolvedValue({ id: 'plat-pc', name: 'PC' });
        (db.game.create as Mock).mockResolvedValue({
            ...mockGame, platform: { id: 'plat-pc', name: 'PC' }, genres: [],
        });

        const req = new Request('http://localhost/api/library', {
            method: 'POST',
            body: JSON.stringify({ title: 'Game', status: 'Queue', coverUrl: 'http://x.com/img.jpg' }),
        });
        const res = await POST(req);
        expect(res.status).toBe(201);
        expect(db.platform.findUnique).toHaveBeenCalledWith({ where: { name: 'PC' } });
    });

    it('returns 400 on zod validation error', async () => {
        const req = new Request('http://localhost/api/library', {
            method: 'POST',
            body: JSON.stringify({ title: '', status: 'InvalidStatus' }),
        });
        const res = await POST(req);
        expect(res.status).toBe(400);
        const json = await res.json();
        expect(json.error.code).toBe('VALIDATION_ERROR');
        expect(json.error.details).toBeDefined();
    });

    it('returns 500 on db error', async () => {
        (db.platform.findUnique as Mock).mockRejectedValue(new Error('DB fail'));
        const req = new Request('http://localhost/api/library', {
            method: 'POST',
            body: JSON.stringify(validBody),
        });
        const res = await POST(req);
        expect(res.status).toBe(500);
        const json = await res.json();
        expect(json.error.code).toBe('SERVER_ERROR');
    });
});