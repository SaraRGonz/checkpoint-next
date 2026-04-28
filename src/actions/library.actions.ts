'use server'

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { addGame, updateGame, deleteGame } from '@/lib/library';
import type { Game } from '@/types/game';

const CreateGameSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    status: z.enum(['Wishlist', 'Queue', 'Playing', 'Completed', 'Dropped']),
    coverUrl: z.url({ message: 'Must be a valid URL' }).optional().or(z.literal('')),
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
        const parsedData = await CreateGameSchema.parseAsync(data);
        
        const gameData = {
            ...parsedData,
            coverUrl: parsedData.coverUrl || '/placeholder.jpg'
        };

        const newGame = await addGame(gameData);
        
        revalidatePath('/');
        revalidatePath('/library');
        
        return { success: true, gameId: newGame.id };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, errors: formatZodErrors(error) };
        }
        return { success: false, error: 'Error interno al añadir el juego' };
    }
}

export async function updateGameAction(id: string, updates: Partial<Game>) {
    try {
        const updatedGame = await updateGame(id, updates);
        
        if (!updatedGame) {
            return { success: false, error: 'Game not found' };
        }

        revalidatePath(`/game/${id}`);
        revalidatePath('/library');
        
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Internal error updating game' };
    }
}

export async function deleteGameAction(id: string) {
    try {
        const success = await deleteGame(id);
        
        if (!success) {
            return { success: false, error: 'Game not found to delete' };
        }

        revalidatePath('/');
        revalidatePath('/library');
        revalidatePath('/wishlist');
        
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Internal error deleting game' };
    }
}