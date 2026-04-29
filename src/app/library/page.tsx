'use client'

import { useRouter } from 'next/navigation';
import { useLibrary } from '@/hooks/useLibrary';
import { useFilters } from '@/hooks/useFilters';
import type { SortOption } from '@/hooks/useFilters';
import { GameCard } from '@/components/game/GameCard';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { ActionMenu } from '@/components/ui/ActionMenu/ActionMenu';
import { STATUS_LIST } from '@/utils/constants';
import { SearchIcon, PlusIcon, GridIcon, KanbanIcon } from '@/components/ui/Icons';
import { Spinner } from '@/components/ui/Spinner';
import { useState, useEffect } from 'react';
import { KanbanBoard } from '@/components/game/KanbanBoard';

export default function LibraryPage() {
    const { games, isLoading } = useLibrary();
    const router = useRouter();
    
    const [viewMode, setViewMode] = useState<'grid' | 'kanban'>('grid');

    useEffect(() => {
        const savedMode = localStorage.getItem('libraryViewMode');
        if (savedMode === 'kanban') setViewMode('kanban');
    }, []);

    useEffect(() => {
        localStorage.setItem('libraryViewMode', viewMode);
    }, [viewMode]);

    const libraryGames = games.filter(g => g.status !== 'Wishlist');

    const {
        filteredGames, availableGenres, availablePlatforms, searchQuery, setSearchQuery, sortOption, setSortOption,
        statusFilter, setStatusFilter, genreFilter, setGenreFilter, platformFilter, setPlatformFilter, ratingFilter, setRatingFilter,
        clearFilters, hasActiveFilters
    } = useFilters(libraryGames);

    const sortLabels: Record<SortOption, string> = {
        'added-desc': 'Recently added',
        'updated-desc': 'Recently updated',
        'title-asc': 'Alphabetical (A-Z)',
        'title-desc': 'Alphabetical (Z-A)'
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Spinner />
            </div>
        );
    }

    if (games.length === 0) {
        return (
            <EmptyState
                onClick={() => router.push('/search')}
                onSecondaryClick={() => router.push('/library/add')}
                secondaryClickText="Add game manually"
            />
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* SIDEBAR */}
            <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
                
                {/* botones de acción */}
                <div className="flex flex-col gap-3">
                    <Button variant="primary" onClick={() => router.push('/search')}>
                        <span className="flex items-center justify-center gap-2">
                            <SearchIcon className="w-5 h-5" />
                            Add game with RAWG
                        </span>
                    </Button>
                    <Button variant="secondary" onClick={() => router.push('/library/add')}>
                        <span className="flex items-center justify-center gap-2">
                            <PlusIcon className="w-5 h-5" />
                            Add game manually
                        </span>
                    </Button>
                </div>

                {/* búsqueda */}
                <div className="w-full">
                    <SearchInput 
                        value={searchQuery} 
                        onChange={setSearchQuery} 
                        placeholder="Search in library..." 
                    />
                </div>

                {/* order by */}
                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Order by</label>
                    <ActionMenu value={sortOption} onSelect={(val) => setSortOption(val as SortOption)}>
                        <ActionMenu.Button>{sortLabels[sortOption]}</ActionMenu.Button>
                        <ActionMenu.Overlay>
                            <ActionMenu.Item value="added-desc">Recently added</ActionMenu.Item>
                            <ActionMenu.Item value="updated-desc">Recently updated</ActionMenu.Item>
                            <ActionMenu.Item value="title-asc">Alphabetical (A-Z)</ActionMenu.Item>
                            <ActionMenu.Item value="title-desc">Alphabetical (Z-A)</ActionMenu.Item>
                        </ActionMenu.Overlay>
                    </ActionMenu>
                </div>

                {/* VIEW MODE */}
                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">View Mode</label>
                    <div className="flex gap-2 bg-gray-950 p-1 rounded-lg border border-gray-800">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`flex-1 py-1.5 flex justify-center items-center rounded-md transition-colors 
                                ${viewMode === 'grid' ? 'bg-gray-800 text-primary' : 'text-gray-500 hover:text-gray-300'}`}
                            title="Grid View"
                        >
                            <GridIcon className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setViewMode('kanban')}
                            className={`flex-1 py-1.5 flex justify-center items-center rounded-md transition-colors 
                                ${viewMode === 'kanban' ? 'bg-gray-800 text-primary' : 'text-gray-500 hover:text-gray-300'}`}
                            title="Kanban View"
                        >
                            <KanbanIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <hr className="border-gray-800" />

                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-primary uppercase tracking-tighter">Filters</h2>
                    {hasActiveFilters && (
                        <button onClick={clearFilters} className="text-[10px] font-bold text-gray-300 hover:text-white uppercase transition-colors">
                            Reset
                        </button>
                    )}
                </div>

                {/* filtros desplegables */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">Status</label>
                        <ActionMenu value={statusFilter} onSelect={setStatusFilter}>
                            <ActionMenu.Button>
                                {statusFilter === 'all' ? 'All' : statusFilter}
                            </ActionMenu.Button>
                            <ActionMenu.Overlay>
                                <ActionMenu.Item value="all">All</ActionMenu.Item>
                                {STATUS_LIST.filter(s => s.value !== 'Wishlist').map(s => (
                                    <ActionMenu.Item key={s.value} value={s.value}>{s.label}</ActionMenu.Item>
                                ))}
                            </ActionMenu.Overlay>
                        </ActionMenu>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">Genre</label>
                        <ActionMenu value={genreFilter} onSelect={setGenreFilter}>
                            <ActionMenu.Button>
                                {genreFilter === 'all' ? 'All' : genreFilter}
                            </ActionMenu.Button>
                            <ActionMenu.Overlay>
                                <ActionMenu.Search />
                                <ActionMenu.Item value="all">All</ActionMenu.Item>
                                {availableGenres.length === 0 ? (
                                    <div className="px-4 py-3 text-xs text-gray-300 italic text-center">Genres not found</div>
                                ) : (
                                    availableGenres.map(g => (
                                        <ActionMenu.Item key={g} value={g}>{g}</ActionMenu.Item>
                                    ))
                                )}
                            </ActionMenu.Overlay>
                        </ActionMenu>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">Platform</label>
                        <ActionMenu value={platformFilter} onSelect={setPlatformFilter} position="top">
                            <ActionMenu.Button>
                                {platformFilter === 'all' ? 'All' : platformFilter}
                            </ActionMenu.Button>
                            <ActionMenu.Overlay>
                                <ActionMenu.Search />
                                <ActionMenu.Item value="all">All</ActionMenu.Item>
                                <ActionMenu.Item value="Not specified">Not specified</ActionMenu.Item> 
                                {availablePlatforms.length === 0 ? (
                                    <div className="px-4 py-3 text-xs text-gray-300 italic text-center">No platforms found</div>
                                ) : (
                                    availablePlatforms.map(p => (
                                        <ActionMenu.Item key={p} value={p}>{p}</ActionMenu.Item>
                                    ))
                                )}
                            </ActionMenu.Overlay>
                        </ActionMenu>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">Rating</label>
                        <ActionMenu value={ratingFilter} onSelect={setRatingFilter} position="top">
                            <ActionMenu.Button>
                                {ratingFilter === 'all' ? 'All' : `${ratingFilter} Stars`}
                            </ActionMenu.Button>
                            <ActionMenu.Overlay>
                                <ActionMenu.Item value="all">All</ActionMenu.Item>
                                {[5, 4, 3, 2, 1].map(stars => (
                                    <ActionMenu.Item key={stars} value={stars.toString()}>{stars} Stars</ActionMenu.Item>
                                ))}
                            </ActionMenu.Overlay>
                        </ActionMenu>
                    </div>
                </div>
            </aside>

            {/* main */}
            <main className="flex-1 w-full min-w-0"> 
                {filteredGames.length === 0 ? (
                    <EmptyState 
                        title="Mission Failed"
                        message="It seems no game survived your selection. Try a different strategy!"
                        onClick={clearFilters}
                        clickText="Respawn Filters"
                    />
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
                        {filteredGames.map((game, index) => (
                            <GameCard 
                                key={game.id} 
                                game={game} 
                                priority={index < 8} // <--- AÑADIDO: Prioridad solo a los 8 primeros
                            />
                        ))}
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-500">
                        <KanbanBoard games={filteredGames} />
                    </div>
                )}
            </main>
        </div>
    );
}