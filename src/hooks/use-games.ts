'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLibrary, updateGameInLibrary, deleteGameFromLibrary } from '@/api/library'; 
import { useUIStore } from '@/stores/ui-store';
import { useShallow } from 'zustand/react/shallow';
import type { Game } from '@/types/game';

export function useGames() {
    const queryClient = useQueryClient();
    
    const filters = useUIStore(useShallow((state) => ({
        search: state.searchQuery,
        sort: state.sortOption,
        status: state.statusFilter,
        genre: state.genreFilter,
        platform: state.platformFilter,
        rating: state.ratingFilter
    })));

    const { data: games = [], isLoading, error } = useQuery({
        queryKey: ['games', filters],
        queryFn: async () => {
            const res = await getLibrary();
            return res.data;
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string, updates: Partial<Game> }) => updateGameInLibrary(id, updates),
        onMutate: async ({ id, updates }) => {
            await queryClient.cancelQueries({ queryKey: ['games'] });
            const previousGames = queryClient.getQueryData<Game[]>(['games', filters]);
            
            if (previousGames) {
                queryClient.setQueryData<Game[]>(['games', filters], old => 
                    old?.map(g => g.id === id ? { ...g, ...updates } : g)
                );
            }
            return { previousGames };
        },
        onError: (err, newTodo, context) => {
            if (context?.previousGames) {
                queryClient.setQueryData(['games', filters], context.previousGames);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['games'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteGameFromLibrary(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['games'] });
        }
    });

    return {
        games,
        isLoading,
        error,
        updateGame: (id: string, updates: Partial<Game>) => updateMutation.mutateAsync({ id, updates }),
        deleteGame: (id: string) => deleteMutation.mutateAsync(id)
    };
}