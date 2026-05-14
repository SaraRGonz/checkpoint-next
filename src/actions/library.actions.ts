'use server'

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const CreateGameSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    status: z.enum(['Wishlist', 'Queue', 'Playing', 'Completed', 'Dropped']),
    coverUrl: z.string().optional().or(z.literal('')),
    coverPosition: z.string().optional(),
    platform: z.string().optional(),
    genres: z.array(z.string()).optional(),
    releaseYear: z.number().optional(),
    rawgId: z.number().optional(),
    review: z.string().optional(),
    rating: z.number().min(0).max(5).optional(),
});

const formatZodErrors = (error: z.ZodError) => {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of error.issues) {
        const path = issue.path.join('.') || 'root';
        if (!fieldErrors[path]) fieldErrors[path] = [];
        fieldErrors[path].push(issue.message);
    }
    return fieldErrors;
};

export async function addGameAction(data: unknown) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return { success: false, error: 'Unauthorized: No active session' };
        }

        const parsedData = await CreateGameSchema.parseAsync(data);
        
        let platformId;
        const platformName = parsedData.platform || "Not specified";
        let platformRecord = await db.platform.findUnique({ where: { name: platformName } });
        if (!platformRecord) {
            platformRecord = await db.platform.create({ data: { name: platformName } });
        }
        platformId = platformRecord.id;

        let genresUpdate = {};
        if (parsedData.genres && parsedData.genres.length > 0) {
            const genreConnections = [];
            for (const genreName of parsedData.genres) {
                let genreRecord = await db.genre.findUnique({ where: { name: genreName } });
                if (!genreRecord) {
                    genreRecord = await db.genre.create({ data: { name: genreName } });
                }
                genreConnections.push({ id: genreRecord.id });
            }
            genresUpdate = { connect: genreConnections };
        }

        const newGame = await db.game.create({
            data: {
                title: parsedData.title,
                status: parsedData.status.toUpperCase() as any,
                coverUrl: parsedData.coverUrl || '/placeholder.jpg',
                coverPosition: parsedData.coverPosition || '50% 50%',
                platformId: platformId,
                releaseYear: parsedData.releaseYear,
                rawgId: parsedData.rawgId,
                rating: parsedData.rating,
                review: parsedData.review,
                genres: genresUpdate,
                userId: session.user.id 
            }
        });
        
        revalidatePath('/');
        revalidatePath('/library');
        
        return { success: true, gameId: newGame.id };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, errors: formatZodErrors(error) };
        }
        return { success: false, error: 'Internal error adding game' };
    }
}