'use client'

import { useState } from 'react'; 
import { useRouter } from 'next/navigation';
import { useLibrary } from '@/hooks/useLibrary';
import { useFilters } from '@/hooks/useFilters';
import type { SortOption } from '@/hooks/useFilters';
import { GameCard } from '@/components/game/GameCard';
import { SearchInput } from '@/components/ui/SearchInput';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { ActionMenu } from '@/components/ui/ActionMenu/ActionMenu';
import { Modal, type ModalButton } from '@/components/ui/Modal'; 
import type { Game } from '@/types/game';
import { TrashIcon, SearchIcon, PlusIcon } from '@/components/ui/Icons';
import { Spinner } from '@/components/ui/Spinner';

export default function WishlistPage() {
    const { games, updateGame, deleteGame, isLoading } = useLibrary();
    const router = useRouter();

    const [gameToDelete, setGameToDelete] = useState<Game | null>(null);

    const wishlistGames = games.filter(g => g.status === 'Wishlist');

    const {
        filteredGames,
        availablePlatforms,
        availableGenres,
        searchQuery, setSearchQuery,
        sortOption, setSortOption,
        genreFilter, setGenreFilter,
        platformFilter, setPlatformFilter,
        clearFilters, hasActiveFilters
    } = useFilters(wishlistGames);

    const sortLabels: Record<SortOption, string> = {
        'added-desc': 'Recently added',
        'updated-desc': 'Recently updated',
        'title-asc': 'Alphabetical (A-Z)',
        'title-desc': 'Alphabetical (Z-A)'
    };

    const handleMoveToLibrary = async (id: string) => {
        await updateGame(id, { status: 'Queue' });
    };

    const handleDeleteConfirm = async () => {
        if (gameToDelete) {
            await deleteGame(gameToDelete.id);
            setGameToDelete(null); 
        }
    };

    const modalButtons: ModalButton[] = [
        { 
            content: 'Cancel', 
            variant: 'secondary', 
            onClick: () => setGameToDelete(null) 
        },
        { 
            content: 'Remove', 
            variant: 'danger', 
            onClick: handleDeleteConfirm 
        }
    ];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Spinner />
            </div>
        );
    }

    if (wishlistGames.length === 0) {
        return (
            <EmptyState
                title="Your wishlist is empty"
                message="Discover new adventures and add them here to keep track of what you want to play next!"
                clickText="Discover games"
                onClick={() => router.push('/search')}
                onSecondaryClick={() => router.push('/library/add')}
                secondaryClickText="Add game manually"
            />
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
                
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

                <div className="w-full">
                    <SearchInput 
                        value={searchQuery} 
                        onChange={setSearchQuery} 
                        placeholder="Search in wishlist..." 
                    />
                </div>

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

                <hr className="border-gray-800" />

                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-primary uppercase tracking-tighter">Filters</h2>
                    {hasActiveFilters && (
                        <button onClick={clearFilters} className="text-[10px] font-bold text-gray-300 hover:text-white uppercase transition-colors">
                            Reset
                        </button>
                    )}
                </div>

                <div className="flex flex-col gap-4">
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
                </div>

            </aside>

            <main className="flex-1 w-full">
                {filteredGames.length === 0 ? (
                    <EmptyState 
                        title="Mission Failed"
                        message="No items found with these filters. Keep scouting!"
                        onClick={clearFilters}
                        clickText="Respawn Filters"
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
                        {filteredGames.map((game, index) => (
                            <div key={game.id} className="flex flex-col gap-3 h-full">
                                <div className="flex-1">
                                    <GameCard 
                                        game={game} 
                                        hideBadge={true} 
                                        priority={index < 8} 
                                    />
                                </div>
                                
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Button className="w-full" variant="primary" onClick={() => handleMoveToLibrary(game.id)}>
                                            <div className="flex items-center justify-center gap-2 text-xs">
                                                <PlusIcon className="w-5 h-5" />
                                                Add to Library
                                            </div>
                                        </Button>
                                    </div>
                                    <div>
                                        <Button variant="danger" onClick={() => setGameToDelete(game)}>
                                        <div className="flex items-center justify-center">
                                            <TrashIcon className="w-4 h-4" />
                                        </div>
                                    </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            
            <Modal
                isOpen={gameToDelete !== null}
                onClose={() => setGameToDelete(null)}
                title="Remove from Wishlist"
                footerButtons={modalButtons}
            >
                <div className="space-y-4">
                    <p>Discard <span className="font-bold text-white">"{gameToDelete?.title}"</span> from your loot list?</p>
                    <p className="text-sm text-gray-400">No worries! You can always find this legendary item again using the search radar.</p>
                </div>
            </Modal>

        </div>
    );
}