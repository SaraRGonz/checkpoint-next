import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from './ui-store';

describe('ui-store', () => {
    beforeEach(() => {
        useUIStore.getState().clearFilters();
    });

    it('setSearchQuery -> mutate state', () => {
        useUIStore.getState().setSearchQuery('Zelda');
        expect(useUIStore.getState().searchQuery).toBe('Zelda');
    });

    it('setViewMode -> mutate state', () => {
        useUIStore.getState().setViewMode('kanban');
        expect(useUIStore.getState().viewMode).toBe('kanban');
    });

    it('clearFilters -> reset values to default', () => {
        const store = useUIStore.getState();
        store.setGenreFilter('RPG');
        store.setStatusFilter('Playing');
        
        store.clearFilters();
        
        const resetStore = useUIStore.getState();
        expect(resetStore.genreFilter).toBe('all');
        expect(resetStore.statusFilter).toBe('all');
        expect(resetStore.searchQuery).toBe('');
    });
});