import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from 'zod';
import { db } from '@/lib/db';

const updateGameSchema = z.object({
    title: z.string().min(1, 'El título es requerido').optional(),
    status: z.enum(['Wishlist', 'Queue', 'Playing', 'Completed', 'Dropped']).optional(),
    coverUrl: z.string().nullable().optional(),
    coverPosition: z.string().nullable().optional(),
    platform: z.string().nullable().optional(),
    availablePlatforms: z.array(z.string()).nullable().optional(),
    rating: z.number().min(0).max(5).nullable().optional(),
    review: z.string().nullable().optional(),
    genres: z.array(z.string()).nullable().optional(),
    releaseYear: z.number().nullable().optional(),
    rawgId: z.number().nullable().optional(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const game = await db.game.findFirst({
            where: { id, userId: session.user.id }, 
            include: { platform: true, genres: true }
        });
        
        if (!game) {
            return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Game not found or unauthorized' } }, { status: 404 });
        }
        
        const formattedGame = {
            ...game,
            status: game.status.charAt(0) + game.status.slice(1).toLowerCase(),
            platform: game.platform.name,
            genres: game.genres.map((g: { name: string }) => g.name)
        };

        return NextResponse.json(formattedGame, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: { code: 'SERVER_ERROR', message: 'Internal server error' } }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;

        const existingGame = await db.game.findFirst({ where: { id, userId: session.user.id } });
        if (!existingGame) return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });

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
                ...(data.title !== undefined && { title: data.title }),
                ...(data.coverUrl !== undefined && { coverUrl: data.coverUrl }),
                ...(data.coverPosition !== undefined && { coverPosition: data.coverPosition }), 
                ...(data.status !== undefined && { status: data.status!.toUpperCase() as any }),
                ...(data.rating !== undefined && { rating: data.rating }),
                ...(data.review !== undefined && { review: data.review }), 
                ...(data.releaseYear !== undefined && { releaseYear: data.releaseYear }),
                ...(data.rawgId !== undefined && { rawgId: data.rawgId }),
                ...(platformId && { platformId }),
                ...(genresUpdate && { genres: genresUpdate })
            },
            include: { platform: true, genres: true }
        });
        
        const formattedGame = {
            ...updatedGame,
            status: updatedGame.status.charAt(0) + updatedGame.status.slice(1).toLowerCase(),
            platform: updatedGame.platform.name,
            genres: updatedGame.genres.map((g: { name: string }) => g.name)
        };
        
        return NextResponse.json(formattedGame, { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: { code: 'VALIDATION_ERROR', message: 'Invalid data' }
            }, { status: 400 });
        }
        return NextResponse.json({ error: { code: 'SERVER_ERROR', message: 'Internal server error' } }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;

        const existingGame = await db.game.findFirst({ where: { id, userId: session.user.id } });
        if (!existingGame) return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });

        await db.game.delete({ where: { id } });
        
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: { code: 'SERVER_ERROR', message: 'Internal server error' } }, { status: 500 });
    }
}