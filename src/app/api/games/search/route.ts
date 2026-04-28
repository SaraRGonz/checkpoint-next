import { NextResponse } from 'next/server';
import { searchRawgGames } from '@/lib/rawg';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q');
        const platform = searchParams.get('platform') || undefined;
        const genre = searchParams.get('genre') || undefined;
        const year = searchParams.get('year') || undefined;

        if (!q) {
            return NextResponse.json({ 
                error: { code: 'BAD_REQUEST', message: 'Query parameter "q" is required' } 
            }, { status: 400 });
        }

        const results = await searchRawgGames(q, platform, genre, year);
        
        return NextResponse.json({ results, count: results.length }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ 
            error: { code: 'RAWG_ERROR', message: error.message || 'Error fetching from RAWG' } 
        }, { status: 502 });
    }
}