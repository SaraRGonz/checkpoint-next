import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SortOption = 'title-asc' | 'title-desc' | 'added-desc' | 'updated-desc';

interface UIState {
    searchQuery: string;
    sortOption: SortOption;
    statusFilter: string;
    genreFilter: string;
    platformFilter: string;
    ratingFilter: string;
    viewMode: 'grid' | 'kanban'; 
    
    setSearchQuery: (val: string) => void;
    setSortOption: (val: SortOption) => void;
    setStatusFilter: (val: string) => void;
    setGenreFilter: (val: string) => void;
    setPlatformFilter: (val: string) => void;
    setRatingFilter: (val: string) => void;
    setViewMode: (val: 'grid' | 'kanban') => void; 
    clearFilters: () => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            searchQuery: '',
            sortOption: 'added-desc',
            statusFilter: 'all',
            genreFilter: 'all',
            platformFilter: 'all',
            ratingFilter: 'all',
            viewMode: 'grid',

            setSearchQuery: (val) => set({ searchQuery: val }),
            setSortOption: (val) => set({ sortOption: val }),
            setStatusFilter: (val) => set({ statusFilter: val }),
            setGenreFilter: (val) => set({ genreFilter: val }),
            setPlatformFilter: (val) => set({ platformFilter: val }),
            setRatingFilter: (val) => set({ ratingFilter: val }),
            setViewMode: (val) => set({ viewMode: val }),
            clearFilters: () => set({
                searchQuery: '',
                sortOption: 'added-desc',
                statusFilter: 'all',
                genreFilter: 'all',
                platformFilter: 'all',
                ratingFilter: 'all'
            })
        }),
        {
            name: 'ui-storage',
        }
    )
);