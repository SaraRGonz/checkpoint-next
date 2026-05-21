'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameDetail } from '@/hooks/useGameDetail';
import { useGames } from '@/hooks/use-games';
import { GameDetailHeader } from '@/components/game/GameDetailHeader';
import { GameCoverColumn } from '@/components/game/GameCoverColumn';
import { GameInfoColumn } from '@/components/game/GameInfoColumn';
import { GameNotes } from '@/components/game/GameNotes';
import { Spinner } from '@/components/ui/Spinner';
import { Modal, type ModalButton } from '@/components/ui/Modal';
import type { Game } from '@/types/game';
import { PlaythroughSection } from './PlaythroughSection';

interface GameDetailClientProps {
    initialGame: Game;
}

const DEFAULT_COVER_URL = '/placeholder.jpg';

export function GameDetailClient({ initialGame }: GameDetailClientProps) {
    const { 
        game, draft, isEditing, isLoading, 
        toggleEdit, updateDraftField, saveChanges, discardChanges 
    } = useGameDetail(initialGame);

    const { deleteGame } = useGames();
    const router = useRouter();      
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    
    const [tempImageUrl, setTempImageUrl] = useState('');
    const [tempCoverPosition, setTempCoverPosition] = useState('50% 50%'); 
    const [imageError, setImageError] = useState<string | null>(null);

    useEffect(() => {
        if (draft) {
            const isPlaceholder = draft.coverUrl === DEFAULT_COVER_URL || draft.coverUrl.includes('placeholder');
            setTempImageUrl(isPlaceholder ? '' : draft.coverUrl);
            setTempCoverPosition(draft.coverPosition || '50% 50%');
            setImageError(null); 
        }
    }, [isImageModalOpen, draft]);

    if (!game || !draft) return <div className="p-20 flex justify-center"><Spinner /></div>;

    const handleDeleteConfirm = async () => {
        await deleteGame(game.id);
        setIsDeleteModalOpen(false);
        router.push('/library'); 
    };

    const isValidUrl = (url: string) => {
        if (!url || url.trim() === '' || url === DEFAULT_COVER_URL) return true;
        try {
            const parsed = new URL(url);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
            return false;
        }
    };

    const handleSaveImage = () => {
        const finalUrl = tempImageUrl.trim();

        if (finalUrl === '') {
            updateDraftField('coverUrl', DEFAULT_COVER_URL);
            setImageError(null);
            setIsImageModalOpen(false);
            return;
        }

        if (!isValidUrl(finalUrl)) {
            updateDraftField('coverUrl', DEFAULT_COVER_URL);
            setImageError(null);
            setIsImageModalOpen(false);
        } else {
            updateDraftField('coverUrl', finalUrl);
            updateDraftField('coverPosition', tempCoverPosition); 
            setImageError(null);
            setIsImageModalOpen(false);
        }
    };

    const deleteModalButtons: ModalButton[] = [
        { content: 'Cancel', variant: 'secondary', onClick: () => setIsDeleteModalOpen(false) },
        { content: 'Delete', variant: 'danger', onClick: handleDeleteConfirm }
    ];

    const imageModalButtons: ModalButton[] = [
        { content: 'Update Image', variant: 'primary', onClick: handleSaveImage }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <GameDetailHeader 
                title={game.title} 
                isEditing={isEditing} 
                onEdit={toggleEdit} 
                onSave={saveChanges} 
                onDiscard={discardChanges} 
                onDelete={() => setIsDeleteModalOpen(true)} 
                onBack={() => router.back()}
            />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                <div className="md:col-span-4 lg:col-span-3 min-w-0">
                    <GameCoverColumn 
                        draft={draft} 
                        isEditing={isEditing} 
                        onOpenImageModal={() => setIsImageModalOpen(true)} 
                    />
                </div>

                <div className="md:col-span-4 lg:col-span-4 min-w-0">
                    <GameInfoColumn draft={draft} isEditing={isEditing} updateDraftField={updateDraftField} />
                </div>

                <div className="md:col-span-4 lg:col-span-5 min-w-0 h-full">
                    <GameNotes 
                        notes={draft.review || ''} 
                        onChange={(n) => updateDraftField('review', n)}
                        isEditing={isEditing}
                        onDoubleClick={() => { if (!isEditing) toggleEdit(); }}
                    />
                </div>
            </div>

            <PlaythroughSection gameId={initialGame.id} initialPlaythroughs={initialGame.playthroughs || []} />

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Game" footerButtons={deleteModalButtons}>
                <div className="space-y-4">
                    <p>Are you sure you want to banish <span className="font-bold text-white">"{game.title}" </span>from your library?</p>
                    <p className="text-sm text-gray-400">Permadeath is on: this action cannot be undone.</p>
                </div>
            </Modal>

            <Modal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} title="Change Cover Image" footerButtons={imageModalButtons}>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Image URL</label>
                        <input 
                            type="text"
                            value={tempImageUrl}
                            onChange={(e) => {
                                setTempImageUrl(e.target.value);
                                if (e.target.value.trim() !== '' && !isValidUrl(e.target.value)) {
                                    setImageError('Warning: The URL format is invalid. A placeholder will be used.');
                                } else if (imageError?.includes('Warning')) {
                                    setImageError(null);
                                }
                            }}
                            className="w-full bg-gray-950 border border-gray-700 p-3 rounded-lg text-sm text-gray-200 focus:border-primary outline-none transition-all"
                            placeholder="https://..."
                        />
                        {imageError && (
                            <p className="text-danger text-xs font-bold mt-1 animate-in fade-in zoom-in duration-200">
                                {imageError}
                            </p>
                        )}
                    </div>
                    <div className="pt-2">
                        <p className="text-[10px] uppercase text-gray-600 font-bold mb-3 tracking-[0.2em] text-center">Preview</p>
                        <div className="w-32 mx-auto aspect-3/4 rounded-xl overflow-hidden border-2 border-gray-700 shadow-2xl bg-gray-950 relative">
                            <img 
                                src={isValidUrl(tempImageUrl) && tempImageUrl.trim() !== '' ? tempImageUrl : DEFAULT_COVER_URL} 
                                alt="Preview" 
                                className="w-full h-full object-cover" 
                                style={{ objectPosition: tempCoverPosition }}
                                onError={(e) => (e.currentTarget.src = DEFAULT_COVER_URL)} 
                            />
                        </div>
                        {tempImageUrl.trim() !== '' && isValidUrl(tempImageUrl) && (
                            <div className="mt-6 space-y-4">
                                {(() => {
                                    const [x, y] = tempCoverPosition.split(' ');
                                    const currentX = parseInt(x || '50');
                                    const currentY = parseInt(y || '50');

                                    return (
                                        <>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex justify-between">
                                                    <span>Horizontal Pan</span>
                                                    <span>{currentX}%</span>
                                                </label>
                                                <input 
                                                    type="range" min="0" max="100" 
                                                    value={currentX}
                                                    onChange={(e) => setTempCoverPosition(`${e.target.value}% ${currentY}%`)}
                                                    className="w-full mt-2 accent-primary"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex justify-between">
                                                    <span>Vertical Pan</span>
                                                    <span>{currentY}%</span>
                                                </label>
                                                <input 
                                                    type="range" min="0" max="100" 
                                                    value={currentY}
                                                    onChange={(e) => setTempCoverPosition(`${currentX}% ${e.target.value}%`)}
                                                    className="w-full mt-2 accent-primary"
                                                />
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}