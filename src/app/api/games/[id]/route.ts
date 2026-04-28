import { NextResponse } from 'next/server';
import { getRawgGameDetails } from '@/lib/rawg';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const data = await getRawgGameDetails(id);
        
        return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ 
            error: { code: 'RAWG_ERROR', message: error.message || 'Error fetching from RAWG' } 
        }, { status: 502 });
    }
}