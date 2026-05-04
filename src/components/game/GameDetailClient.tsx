'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useGameDetail } from '../../hooks/useGameDetail';
import { useLibrary } from '../../hooks/useLibrary';
import { GameDetailHeader } from './GameDetailHeader';
import { GameCoverColumn } from './GameCoverColumn';
import { GameInfoColumn } from './GameInfoColumn';
import { GameNotes } from './GameNotes';
import { Modal, type ModalButton } from '../ui/Modal';
import { Spinner } from '../ui/Spinner';
import type { Game } from '../../types/game';

interface GameDetailClientProps {
    game: Game;
}

export function GameDetailClient({ game: initialGame }: GameDetailClientProps) {
    const router = useRouter();
    
    const { 
        game, draft, isEditing, isLoading, 
        toggleEdit, updateDraftField, saveChanges, discardChanges 
    } = useGameDetail();

    const { deleteGame } = useLibrary(); 
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    
    const [tempImageUrl, setTempImageUrl] = useState('');
    const [tempCoverPosition, setTempCoverPosition] = useState('50% 50%'); 
    const [imageError, setImageError] = useState<string | null>(null);

    const placeholderImg = '/placeholder.jpg';

    useEffect(() => {
        if (draft) {
            const isPlaceholder = draft.coverUrl === placeholderImg || draft.coverUrl.includes('placeholder');
            setTempImageUrl(isPlaceholder ? '' : draft.coverUrl);
            setTempCoverPosition(draft.coverPosition || '50% 50%');
            setImageError(null); 
        }
    }, [isImageModalOpen, draft]);

    const currentGame = game || initialGame;
    const currentDraft = draft || initialGame;

    if (isLoading && !game) return <div className="p-20 flex justify-center"><Spinner /></div>;

    const handleDeleteConfirm = async () => {
        await deleteGame(currentGame.id);
        setIsDeleteModalOpen(false);
        router.push('/library'); 
    };

    const handleSaveImage = () => {
        const finalUrl = tempImageUrl.trim();

        if (finalUrl === '') {
            updateDraftField('coverUrl', placeholderImg);
            setIsImageModalOpen(false);
            return;
        }

        try {
            const url = new URL(finalUrl);
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                throw new Error('Invalid protocol');
            }
            
            updateDraftField('coverUrl', finalUrl);
            updateDraftField('coverPosition', tempCoverPosition); 
            setImageError(null);
            setIsImageModalOpen(false);
        } catch (_) {
            setImageError('Please enter a valid link for the image (e.g., https://...)');
        }
    };

    const deleteModalButtons: ModalButton[] = [
        { content: 'Cancel', variant: 'secondary', onClick: () => setIsDeleteModalOpen(false) },
        { content: 'Delete', variant: 'danger', onClick: handleDeleteConfirm }
    ];

    const imageModalButtons: ModalButton[] = [
        { content: 'Cancel', variant: 'secondary', onClick: () => setIsImageModalOpen(false) },
        { content: 'Update Image', variant: 'primary', onClick: handleSaveImage }
    ];

    const previewSrc = tempImageUrl.trim() === '' ? placeholderImg : tempImageUrl;

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <GameDetailHeader 
                title={currentGame.title} 
                isEditing={isEditing} 
                onEdit={toggleEdit} 
                onSave={saveChanges} 
                onDiscard={discardChanges} 
                onDelete={() => setIsDeleteModalOpen(true)} 
                onBack={() => router.back()} 
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-3">
                    <GameCoverColumn 
                        draft={currentDraft} 
                        isEditing={isEditing} 
                        onOpenImageModal={() => setIsImageModalOpen(true)} 
                    />
                </div>

                <div className="lg:col-span-4">
                    <GameInfoColumn draft={currentDraft} isEditing={isEditing} updateDraftField={updateDraftField} />
                </div>

                <div className="lg:col-span-5 h-full">
                    <GameNotes 
                        notes={currentDraft.review || ''} 
                        onChange={(n) => updateDraftField('review', n)}
                        isEditing={isEditing}
                        onDoubleClick={() => !isEditing && toggleEdit()}
                    />
                </div>
            </div>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Game" footerButtons={deleteModalButtons}>
                <div className="space-y-4">
                    <p>Are you sure you want to banish <span className="font-bold text-white">"{currentGame.title}" </span>from your library?</p>
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
                            onChange={(e) => setTempImageUrl(e.target.value)}
                            className="w-full bg-gray-950 border border-gray-700 p-3 rounded-lg text-sm text-gray-200 focus:border-primary outline-none transition-all"
                            placeholder="https://..."
                        />
                        {imageError && (
                            <p className="text-danger text-xs font-bold mt-1 animate-in fade-in zoom-in duration-200">
                                {imageError}
                            </p>
                        )}
                    </div>

                    {/* VISTA PREVIA Y CONTROLES PAN & TILT */}
                    <div className="pt-2">
                        <p className="text-[10px] uppercase text-gray-600 font-bold mb-3 tracking-[0.2em] text-center">Preview</p>
                        <div className="w-32 mx-auto aspect-3/4 rounded-xl overflow-hidden border-2 border-gray-700 shadow-2xl bg-gray-950 relative">
                            <Image 
                                src={previewSrc} 
                                alt="Preview" 
                                fill
                                sizes="128px"
                                className="object-cover" 
                                style={{ objectPosition: tempCoverPosition }}
                                onError={(e) => {
                                    // Fallback manual si la URL falla
                                    const target = e.target as HTMLImageElement;
                                    target.srcset = placeholderImg;
                                }} 
                            />
                        </div>
                        
                        {/* CONTROLES DE RECORTE (PAN & TILT) */}
                        {tempImageUrl.trim() !== '' && (
                            <div className="mt-6 space-y-4">
                                {(() => {
                                    const [x, y] = tempCoverPosition.split(' ');
                                    const currentX = parseInt(x || '50');
                                    const currentY = parseInt(y || '50');

                                    return (
                                        <>
                                            {/* Slider Horizontal */}
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

                                            {/* Slider vertical */}
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