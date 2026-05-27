import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from 'zod';
import { db } from '@/lib/db';

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

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') ?? '';

        const games = await db.game.findMany({
            where: {
                userId: session.user.id, 
                title: { contains: search, mode: 'insensitive' }
            },
            include: { platform: true, genres: true },
            orderBy: { addedAt: 'desc' }
        });

        const formattedGames = games.map((game: any) => ({
            ...game,
            status: game.status.charAt(0) + game.status.slice(1).toLowerCase(), 
            platform: game.platform?.name || 'Unknown',
            genres: game.genres.map((g: { name: string }) => g.name)
        }));

        return NextResponse.json({ data: formattedGames, total: formattedGames.length }, { status: 200 });
    } catch {
        return NextResponse.json({ error: { code: 'SERVER_ERROR', message: 'Internal server error' } }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const data = await createGameSchema.parseAsync(body);
        
        const platformName = data.platform || 'PC'; 
        let platformRecord = await db.platform.findUnique({ where: { name: platformName } });
        if (!platformRecord) {
            platformRecord = await db.platform.create({ data: { name: platformName } });
        }

        const genreConnections = [];
        if (data.genres && data.genres.length > 0) {
            for (const genreName of data.genres) {
                let genreRecord = await db.genre.findUnique({ where: { name: genreName } });
                if (!genreRecord) {
                    genreRecord = await db.genre.create({ data: { name: genreName } });
                }
                genreConnections.push({ id: genreRecord.id });
            }
        }

        const mappedStatus = data.status ? data.status.toUpperCase() as any : 'QUEUE';

        const newGame = await db.game.create({
            data: {
                title: data.title,
                coverUrl: data.coverUrl,
                status: mappedStatus,
                rating: data.rating,
                releaseYear: data.releaseYear,
                rawgId: data.rawgId,
                userId: session.user.id, 
                platformId: platformRecord.id,
                genres: { connect: genreConnections }
            },
            include: { platform: true, genres: true }
        });

        const formattedGame = {
            ...newGame,
            status: newGame.status.charAt(0) + newGame.status.slice(1).toLowerCase(),
            platform: newGame.platform.name,
            genres: newGame.genres.map((g: { name: string }) => g.name)
        };

        return NextResponse.json(formattedGame, { status: 201 });
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