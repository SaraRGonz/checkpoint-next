import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAllGames, addGame } from '@/lib/library';

const createGameSchema = z.object({
    title: z.string().min(1, 'El título es requerido'),
    status: z.enum(['Wishlist', 'Queue', 'Playing', 'Completed', 'Dropped']),
    coverUrl: z.string(),
    coverPosition: z.string().optional(),
    platform: z.string().optional(),
    availablePlatforms: z.array(z.string()).optional(),
    rating: z.number().min(0).max(5).optional(),
    review: z.string().optional(),
    genres: z.array(z.string()).optional(),
    releaseYear: z.number().optional(),
    rawgId: z.number().optional(),
});

export async function GET() {
    try {
        const games = await getAllGames();
        return NextResponse.json({ data: games, total: games.length }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: { code: 'SERVER_ERROR', message: 'Internal server error' } }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = await createGameSchema.parseAsync(body);
        
        const newGame = await addGame(data);
        return NextResponse.json(newGame, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid data provided',
                    details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message }))
                }
            }, { status: 400 });
        }
        return NextResponse.json({ error: { code: 'SERVER_ERROR', message: 'Internal server error' } }, { status: 500 });
    }
}