import { describe, it, expect, vi, type Mock } from 'vitest';
import { GET } from './route';
import { db } from '@/lib/db';

vi.mock('@/lib/db', () => ({
    db: {
        game: {
            findMany: vi.fn()
        }
    }
}));

vi.mock('next-auth', () => ({
    default: vi.fn(),
    getServerSession: vi.fn().mockResolvedValue({ user: { id: 'server-user-1' } })
}));

describe('GET /api/library', () => {
    it('returns games from mock database', async () => {
        const mockGames = [{ 
            id: '1', 
            title: 'Halo', 
            status: 'QUEUE', 
            platform: { name: 'Xbox' },
            genres: [{ name: 'Shooter' }]
        }];
        (db.game.findMany as Mock).mockResolvedValue(mockGames);

        const req = new Request('http://localhost:3000/api/library?search=');
        const res = await GET(req);
        const json = await res.json();

        expect(res.status).toBe(200);
        
        expect(json.data[0].title).toBe('Halo');
        expect(json.data[0].platform).toBe('Xbox');
        
        expect(db.game.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: { userId: 'server-user-1', title: { contains: '', mode: 'insensitive' } }
        }));
    });
});