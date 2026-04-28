import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getGameById, updateGame, deleteGame } from '@/lib/library';

const updateGameSchema = z.object({
    title: z.string().min(1, 'El título es requerido').optional(),
    status: z.enum(['Wishlist', 'Queue', 'Playing', 'Completed', 'Dropped']).optional(),
    coverUrl: z.string().optional(),
    coverPosition: z.string().optional(),
    platform: z.string().optional(),
    availablePlatforms: z.array(z.string()).optional(),
    rating: z.number().min(0).max(5).optional(),
    review: z.string().optional(),
    genres: z.array(z.string()).optional(),
    releaseYear: z.number().optional(),
    rawgId: z.number().optional(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const game = await getGameById(id);
    
    if (!game) {
        return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Game not found' } }, { status: 404 });
    }
    
    return NextResponse.json(game, { status: 200 });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const data = await updateGameSchema.parseAsync(body);
        
        const updatedGame = await updateGame(id, data);
        
        if (!updatedGame) {
            return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Game not found' } }, { status: 404 });
        }
        
        return NextResponse.json(updatedGame, { status: 200 });
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

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const success = await deleteGame(id);
    
    if (!success) {
        return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Game not found' } }, { status: 404 });
    }
    
    return new NextResponse(null, { status: 204 });
}