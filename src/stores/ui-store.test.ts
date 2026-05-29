import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from './ui-store';

beforeEach(() => {
    useUIStore.getState().clearFilters();
    useUIStore.setState({ viewMode: 'grid' });
});

describe('useUIStore', () => {
    it('sets searchQuery', () => {
        useUIStore.getState().setSearchQuery('zelda');
        expect(useUIStore.getState().searchQuery).toBe('zelda');
    });

    it('sets sortOption', () => {
        useUIStore.getState().setSortOption('title-asc');
        expect(useUIStore.getState().sortOption).toBe('title-asc');
    });

    it('sets statusFilter', () => {
        useUIStore.getState().setStatusFilter('Playing');
        expect(useUIStore.getState().statusFilter).toBe('Playing');
    });

    it('sets genreFilter', () => {
        useUIStore.getState().setGenreFilter('RPG');
        expect(useUIStore.getState().genreFilter).toBe('RPG');
    });

    it('sets platformFilter', () => {
        useUIStore.getState().setPlatformFilter('PC');
        expect(useUIStore.getState().platformFilter).toBe('PC');
    });

    it('sets ratingFilter', () => {
        useUIStore.getState().setRatingFilter('5');
        expect(useUIStore.getState().ratingFilter).toBe('5');
    });

    it('sets viewMode to kanban', () => {
        useUIStore.getState().setViewMode('kanban');
        expect(useUIStore.getState().viewMode).toBe('kanban');
    });

    it('clearFilters resets all filters but keeps viewMode', () => {
        useUIStore.getState().setSearchQuery('test');
        useUIStore.getState().setGenreFilter('RPG');
        useUIStore.getState().setViewMode('kanban');
        useUIStore.getState().clearFilters();
        const s = useUIStore.getState();
        expect(s.searchQuery).toBe('');
        expect(s.genreFilter).toBe('all');
        expect(s.sortOption).toBe('added-desc');
        expect(s.viewMode).toBe('kanban');
    });
});