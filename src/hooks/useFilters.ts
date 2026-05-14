import { useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useUIStore } from '@/stores/ui-store';
import type { Game } from '@/types/game';

export function useFilters(initialGames: Game[]) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const store = useUIStore();

    useEffect(() => {
        const state = useUIStore.getState();
        const q = searchParams.get('q') || '';
        const sort = (searchParams.get('sort') as any) || 'added-desc';
        const status = searchParams.get('status') || 'all';
        const genre = searchParams.get('genre') || 'all';
        const platform = searchParams.get('platform') || 'all';
        const rating = searchParams.get('rating') || 'all';

        if (q !== state.searchQuery) state.setSearchQuery(q);
        if (sort !== state.sortOption) state.setSortOption(sort);
        if (status !== state.statusFilter) state.setStatusFilter(status);
        if (genre !== state.genreFilter) state.setGenreFilter(genre);
        if (platform !== state.platformFilter) state.setPlatformFilter(platform);
        if (rating !== state.ratingFilter) state.setRatingFilter(rating);
    }, [searchParams]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (store.searchQuery) params.set('q', store.searchQuery);
        if (store.sortOption !== 'added-desc') params.set('sort', store.sortOption);
        if (store.statusFilter !== 'all') params.set('status', store.statusFilter);
        if (store.genreFilter !== 'all') params.set('genre', store.genreFilter);
        if (store.platformFilter !== 'all') params.set('platform', store.platformFilter);
        if (store.ratingFilter !== 'all') params.set('rating', store.ratingFilter);

        const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
        router.replace(newUrl, { scroll: false });
    }, [store.searchQuery, store.sortOption, store.statusFilter, store.genreFilter, store.platformFilter, store.ratingFilter, pathname, router]);

    const availableGenres = useMemo(() => {
        const genres = new Set<string>();
        initialGames.forEach(game => {
            if (game.genres?.length) {
                game.genres.forEach(g => {
                    genres.add(g.charAt(0).toUpperCase() + g.slice(1).toLowerCase());
                });
            }
        });
        return Array.from(genres).sort(); 
    }, [initialGames]);

    const availablePlatforms = useMemo(() => {
        const platforms = new Set<string>();
        initialGames.forEach(game => {
            if (game.platform?.trim()) {
                platforms.add(game.platform);
            }
        });
        return Array.from(platforms).sort(); 
    }, [initialGames]);

    const baseFilteredGames = useMemo(() => {
        let result = initialGames;
        if (store.searchQuery) result = result.filter(g => g.title.toLowerCase().includes(store.searchQuery.toLowerCase()));
        if (store.genreFilter !== 'all') result = result.filter(g => g.genres?.some(gen => gen.toLowerCase() === store.genreFilter.toLowerCase()));
        if (store.platformFilter !== 'all') {
            result = store.platformFilter === 'Not specified' 
                ? result.filter(g => !g.platform?.trim()) 
                : result.filter(g => g.platform === store.platformFilter);
        }
        if (store.ratingFilter !== 'all') result = result.filter(g => g.rating === parseInt(store.ratingFilter, 10));

        result.sort((a, b) => {
            switch (store.sortOption) {
                case 'title-asc': return a.title.localeCompare(b.title);
                case 'title-desc': return b.title.localeCompare(a.title);
                case 'updated-desc': return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
                case 'added-desc': default: return new Date(b.addedAt || 0).getTime() - new Date(a.addedAt || 0).getTime();
            }
        });
        return result;
    }, [initialGames, store.searchQuery, store.genreFilter, store.platformFilter, store.ratingFilter, store.sortOption]);

    const filteredGames = useMemo(() => {
        if (store.statusFilter === 'all') return baseFilteredGames;
        return baseFilteredGames.filter(g => g.status === store.statusFilter);
    }, [baseFilteredGames, store.statusFilter]);

    const clearFilters = useCallback(() => {
        store.clearFilters();
    }, [store]);

    const hasActiveFilters = store.searchQuery !== '' || store.sortOption !== 'added-desc' || store.statusFilter !== 'all' || store.genreFilter !== 'all' || store.platformFilter !== 'all' || store.ratingFilter !== 'all';

    return { baseFilteredGames, filteredGames, availableGenres, availablePlatforms, clearFilters, hasActiveFilters };
}