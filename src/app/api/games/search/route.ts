import { NextResponse } from 'next/server';
import { searchRawgGames } from '@/lib/rawg';

const rateLimitMap = new Map<string, { count: number, lastReset: number }>();
const WINDOW_MS = 60 * 1000; 
const MAX_REQUESTS = 20; 

export async function GET(req: Request) {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown_ip';
    const now = Date.now();

    const limitData = rateLimitMap.get(ip);

    if (limitData) {
        if (now - limitData.lastReset < WINDOW_MS) {
            if (limitData.count >= MAX_REQUESTS) {
                return NextResponse.json(
                    { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please try again later.' } },
                    { status: 429, headers: { 'Retry-After': '60' } }
                );
            }
            limitData.count++;
        } else {
            rateLimitMap.set(ip, { count: 1, lastReset: now });
        }
    } else {
        rateLimitMap.set(ip, { count: 1, lastReset: now });
    }

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