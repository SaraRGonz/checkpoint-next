'use client'

import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createPlaythrough, updatePlaythrough, deletePlaythrough } from '@/api/playthroughs';
import type { Playthrough } from '@/types/playthrough';
import { useRouter } from 'next/navigation';

export function usePlaythroughs(initialPlaythroughs: Playthrough[], gameId: string) {
    const [playthroughs, setPlaythroughs] = useState<Playthrough[]>([]);
    const router = useRouter();

    useEffect(() => {
        const mapped = initialPlaythroughs.map(p => ({
            ...p,
            status: p.status.charAt(0) + p.status.slice(1).toLowerCase() as any
        }));
        setPlaythroughs(mapped);
    }, [initialPlaythroughs]);

    const createMutation = useMutation({
        mutationFn: () => createPlaythrough(gameId),
        onSuccess: (newP: Playthrough) => {
            const formatted: Playthrough = { ...newP, status: 'Queue' };
            setPlaythroughs(prev => [...prev, formatted]);
            router.refresh();
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string, updates: Partial<Playthrough> }) => updatePlaythrough(id, updates),
        onSuccess: (updatedP: Playthrough, { updates }) => {
            setPlaythroughs(prev => prev.map(p => p.id === updatedP.id ? { ...p, ...updates } : p));
            router.refresh();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deletePlaythrough(id),
        onSuccess: (_, id: string) => {
            setPlaythroughs(prev => prev.filter(p => p.id !== id));
            router.refresh();
        }
    });

    return {
        playthroughs,
        addPlaythrough: async () => {
            const newP = await createMutation.mutateAsync();
            return { ...newP, status: 'Queue' as const };
        },
        updatePlaythrough: (id: string, updates: Partial<Playthrough>) => updateMutation.mutateAsync({ id, updates }),
        deletePlaythrough: (id: string) => deleteMutation.mutateAsync(id)
    };
}