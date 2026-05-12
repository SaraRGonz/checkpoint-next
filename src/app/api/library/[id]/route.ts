import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

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
    try {
        const { id } = await params;
        const game = await db.game.findUnique({
            where: { id },
            include: { platform: true, genres: true }
        });
        
        if (!game) {
            return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Game not found' } }, { status: 404 });
        }
        
        const formattedGame = {
            ...game,
            status: game.status.charAt(0) + game.status.slice(1).toLowerCase(),
            platform: game.platform.name,
            genres: game.genres.map(g => g.name)
        };

        return NextResponse.json(formattedGame, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: { code: 'SERVER_ERROR', message: 'Internal server error' } }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const data = await updateGameSchema.parseAsync(body);
        
        let platformId;
        if (data.platform) {
            let platformRecord = await db.platform.findUnique({ where: { name: data.platform } });
            if (!platformRecord) {
                platformRecord = await db.platform.create({ data: { name: data.platform } });
            }
            platformId = platformRecord.id;
        }

        let genresUpdate;
        if (data.genres) {
            const genreConnections = [];
            for (const genreName of data.genres) {
                let genreRecord = await db.genre.findUnique({ where: { name: genreName } });
                if (!genreRecord) {
                    genreRecord = await db.genre.create({ data: { name: genreName } });
                }
                genreConnections.push({ id: genreRecord.id });
            }
            genresUpdate = { set: genreConnections }; 
        }

        const updatedGame = await db.game.update({
            where: { id },
            data: {
                ...(data.title && { title: data.title }),
                ...(data.coverUrl && { coverUrl: data.coverUrl }),
                ...(data.status && { status: data.status.toUpperCase() as any }),
                ...(data.rating !== undefined && { rating: data.rating }),
                ...(data.releaseYear && { releaseYear: data.releaseYear }),
                ...(data.rawgId && { rawgId: data.rawgId }),
                ...(platformId && { platformId }),
                ...(genresUpdate && { genres: genresUpdate })
            },
            include: { platform: true, genres: true }
        });
        
        const formattedGame = {
            ...updatedGame,
            status: updatedGame.status.charAt(0) + updatedGame.status.slice(1).toLowerCase(),
            platform: updatedGame.platform.name,
            genres: updatedGame.genres.map(g => g.name)
        };
        
        return NextResponse.json(formattedGame, { status: 200 });
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
        if ((error as any).code === 'P2025') {
            return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Game not found' } }, { status: 404 });
        }
        return NextResponse.json({ error: { code: 'SERVER_ERROR', message: 'Internal server error' } }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await db.game.delete({ where: { id } });
        
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        if ((error as any).code === 'P2025') {
            return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Game not found' } }, { status: 404 });
        }
        return NextResponse.json({ error: { code: 'SERVER_ERROR', message: 'Internal server error' } }, { status: 500 });
    }
}