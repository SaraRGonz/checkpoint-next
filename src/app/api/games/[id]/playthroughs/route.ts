import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });
        
        const { id } = await params;
        const p = await db.playthrough.create({
            data: {
                userId: session.user.id,
                gameId: id,
                status: 'QUEUE'
            },
            include: { platform: true }
        });
        
        return NextResponse.json(p, { status: 201 });
    } catch {
        return NextResponse.json({ error: { message: 'Server error' } }, { status: 500 });
    }
}