import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const updatePlaythroughSchema = z.object({
    status: z.enum(['Queue', 'Playing', 'Completed', 'Dropped']).optional(),
    rating: z.number().min(0).max(5).optional().nullable(),
    notes: z.string().optional().nullable(),
    characterName: z.string().optional().nullable(),
    serverName: z.string().optional().nullable(),
    endDate: z.coerce.date().optional().nullable(),
    platformName: z.string().optional().nullable()
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const playthrough = await db.playthrough.findUnique({
            where: { id },
            include: { platform: true, game: { select: { title: true } } }
        });
        if (!playthrough) return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 });
        return NextResponse.json(playthrough, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: { code: 'SERVER_ERROR' } }, { status: 500 });
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
                ...(data.status && { status: data.status.toUpperCase() as any }),
                ...(data.rating !== undefined && { rating: data.rating }),
                ...(data.notes !== undefined && { notes: data.notes }),
                ...(data.characterName !== undefined && { characterName: data.characterName }),
                ...(data.serverName !== undefined && { serverName: data.serverName }),
                ...(data.endDate !== undefined && { endDate: data.endDate }),
                ...(data.platformName !== undefined && {
                    platform: data.platformName 
                        ? { connect: { name: data.platformName } } 
                        : { disconnect: true }
                })
            },
            include: { platform: true }
        });
        
        return NextResponse.json(updatedPlaythrough, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: { message: 'Server error' } }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await db.playthrough.delete({ where: { id } });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: { message: 'Error' } }, { status: 500 });
    }
}