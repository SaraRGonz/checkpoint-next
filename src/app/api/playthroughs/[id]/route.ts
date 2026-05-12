import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

// Validación estricta para la actualización de partidas
const updatePlaythroughSchema = z.object({
    status: z.enum(['WISHLIST', 'COMPLETED', 'PLAYING', 'QUEUE', 'DROPPED']).optional(),
    rating: z.number().min(0).max(5).optional().nullable(),
    notes: z.string().optional().nullable(),
    characterName: z.string().optional().nullable(),
    serverName: z.string().optional().nullable(),
    endDate: z.coerce.date().optional().nullable(),
    platformId: z.string().optional()
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const playthrough = await db.playthrough.findUnique({
            where: { id },
            include: { platform: true, game: { select: { title: true } } }
        });
        
        if (!playthrough) {
            return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Playthrough not found' } }, { status: 404 });
        }

        return NextResponse.json(playthrough, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: { code: 'SERVER_ERROR', message: 'Internal server error' } }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const data = await updatePlaythroughSchema.parseAsync(body);
        
        const updatedPlaythrough = await db.playthrough.update({
            where: { id },
            data: {
                ...(data.status && { status: data.status as any }),
                ...(data.rating !== undefined && { rating: data.rating }),
                ...(data.notes !== undefined && { notes: data.notes }),
                ...(data.characterName !== undefined && { characterName: data.characterName }),
                ...(data.serverName !== undefined && { serverName: data.serverName }),
                ...(data.endDate !== undefined && { endDate: data.endDate }),
                ...(data.platformId && { platform: { connect: { id: data.platformId } } })
            },
            include: { platform: true }
        });
        
        return NextResponse.json(updatedPlaythrough, { status: 200 });
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
            return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Playthrough not found' } }, { status: 404 });
        }
        return NextResponse.json({ error: { code: 'SERVER_ERROR', message: 'Internal server error' } }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await db.playthrough.delete({ where: { id } });
        
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        if ((error as any).code === 'P2025') {
            return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Playthrough not found' } }, { status: 404 });
        }
        return NextResponse.json({ error: { code: 'SERVER_ERROR', message: 'Internal server error' } }, { status: 500 });
    }
}