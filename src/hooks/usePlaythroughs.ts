'use client'

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createPlaythrough, updatePlaythrough, deletePlaythrough } from '@/api/playthroughs';
import type { Playthrough } from '@/types/playthrough';
import { useRouter } from 'next/navigation';

export function usePlaythroughs(initialPlaythroughs: Playthrough[], gameId: string) {
    const router = useRouter();
    
    const [localPlaythroughs, setLocalPlaythroughs] = useState<Playthrough[] | null>(null);

    const activePlaythroughs = (localPlaythroughs ?? initialPlaythroughs).map(p => ({
        ...p,
        status: (p.status.charAt(0).toUpperCase() + p.status.slice(1).toLowerCase()) as Playthrough['status']
    }));

    const createMutation = useMutation({
        mutationFn: () => createPlaythrough(gameId),
        onSuccess: (newP: Playthrough) => {
            const formatted: Playthrough = { ...newP, status: 'Queue' as Playthrough['status'] };
            setLocalPlaythroughs([...activePlaythroughs, formatted]);
            router.refresh();
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string, updates: Partial<Playthrough> }) => updatePlaythrough(id, updates),
        onSuccess: (updatedP: Playthrough, { updates }) => {
            setLocalPlaythroughs(activePlaythroughs.map(p => p.id === updatedP.id ? { ...p, ...updates } : p));
            router.refresh();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deletePlaythrough(id),
        onSuccess: (_, id: string) => {
            setLocalPlaythroughs(activePlaythroughs.filter(p => p.id !== id));
            router.refresh();
        }
    });

    return {
        playthroughs: activePlaythroughs,
        addPlaythrough: async () => {
            const newP = await createMutation.mutateAsync();
            return { ...newP, status: 'Queue' as Playthrough['status'] };
        },
        updatePlaythrough: (id: string, updates: Partial<Playthrough>) => updateMutation.mutateAsync({ id, updates }),
        deletePlaythrough: (id: string) => deleteMutation.mutateAsync(id)
    };
}