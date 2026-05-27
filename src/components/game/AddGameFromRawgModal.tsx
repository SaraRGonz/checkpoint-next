'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal, type ModalButton } from '@/components/ui/Modal';
import { ActionMenu } from '@/components/ui/ActionMenu/ActionMenu';
import { Button } from '@/components/ui/Button';
import { CheckIcon, ArrowRightIcon, SearchIcon, GridIcon } from '@/components/ui/Icons';
import { STATUS_LIST } from '@/utils/constants';
import { RAWG_PLATFORMS } from '@/utils/rawgConstants';
import Image from 'next/image';
import type { Game, GameStatus } from '@/types/game';

interface AddGameFromRawgModalProps {
    isOpen: boolean;
    onClose: () => void;
    game: Game | null;
    initialPlatformId: string;
    initialStatus: GameStatus;
    onSave: (gameData: Omit<Game, 'id'>) => Promise<string | null>;
}

export function AddGameFromRawgModal({ isOpen, onClose, game, initialPlatformId, initialStatus, onSave }: AddGameFromRawgModalProps) {
    const router = useRouter();
    const initialPlatformLabel = initialPlatformId
        ? RAWG_PLATFORMS.find(p => p.id === initialPlatformId)?.label || ''
        : '';

    const [platform, setPlatform] = useState(initialPlatformLabel);
    const [status, setStatus] = useState<GameStatus>(initialStatus);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [newGameId, setNewGameId] = useState<string | null>(null);

    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
    if (isOpen && !prevIsOpen) {
        setPlatform(initialPlatformLabel);
        setStatus(initialStatus);
        setSaveSuccess(false);
        setNewGameId(null);
        setPrevIsOpen(true);
    } else if (!isOpen && prevIsOpen) {
        setPrevIsOpen(false);
    }

    if (!game) return null;

    const isWishlistFlow = initialStatus === 'Wishlist';
    const filteredStatusList = STATUS_LIST.filter(s =>
        isWishlistFlow ? s.value === 'Wishlist' : s.value !== 'Wishlist'
    );

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const returnedId = await onSave({
                ...game,
                platform: platform || undefined,
                status: status,
            });
            if (returnedId) {
                setNewGameId(returnedId);
                setSaveSuccess(true);
            }
        } catch (error) {
            console.error("Error al guardar el juego:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const configFooterButtons: ModalButton[] = [
        {
            content: isSaving ? 'Saving...' : 'Save Game',
            variant: 'primary',
            onClick: handleSave,
            disabled: isSaving
        }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={saveSuccess ? "Game Saved!" : "Configure Game"}
            footerButtons={saveSuccess ? undefined : configFooterButtons}
            closeIconClassName="text-gray-400 hover:text-danger transition-colors"
        >
            {!saveSuccess && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex gap-4 items-center mb-6">
                        <div className="relative w-16 h-24 shrink-0 rounded shadow-md border border-gray-700 overflow-hidden">
                            <Image
                                src={game.coverUrl || '/placeholder.jpg'}
                                alt="Cover"
                                fill
                                sizes="64px"
                                className="object-cover"
                            />
                        </div>

                        <div>
                            <h3 className="font-bold text-white leading-tight">{game.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{game.releaseYear || 'Unknown Year'}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Platform</label>
                        <ActionMenu value={platform} onSelect={setPlatform}>
                            <ActionMenu.Button>{platform || 'Select Platform'}</ActionMenu.Button>
                            <ActionMenu.Overlay>
                                <ActionMenu.Search />
                                <ActionMenu.Item value="">Not specified</ActionMenu.Item>
                                {RAWG_PLATFORMS.map(p => (
                                    <ActionMenu.Item key={p.id} value={p.label}>{p.label}</ActionMenu.Item>
                                ))}
                            </ActionMenu.Overlay>
                        </ActionMenu>
                    </div>

                    {!isWishlistFlow && (
                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Status</label>
                            <ActionMenu value={status} onSelect={(val) => setStatus(val as GameStatus)}>
                                <ActionMenu.Button>{status}</ActionMenu.Button>
                                <ActionMenu.Overlay>
                                    {filteredStatusList.map(s => (
                                        <ActionMenu.Item key={s.value} value={s.value}>{s.label}</ActionMenu.Item>
                                    ))}
                                </ActionMenu.Overlay>
                            </ActionMenu>
                        </div>
                    )}
                </div>
            )}

            {saveSuccess && (
                <div className="space-y-8 py-4 animate-in fade-in zoom-in-95 duration-300 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-success/20 text-success p-4 rounded-full border-4 border-success/30 shadow-lg">
                            <CheckIcon className="w-12 h-12 text-text" />
                        </div>
                        <p className="text-gray-200 font-medium max-w-xs mx-auto">
                            <strong className="text-white">
                                {game.title}</strong> has been successfully added to your <strong className="text-white">{isWishlistFlow ? 'Wishlist' : 'Library'}</strong>.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2">
                        <Button
                            variant="secondary"
                            className="flex flex-col items-center gap-3 py-6 h-auto text-center"
                            onClick={() => router.push(isWishlistFlow ? '/wishlist' : '/library')}
                        >
                            <GridIcon className="w-8 h-8 text-primary" />
                            <div className="flex flex-col gap-1">
                                <span className="font-bold ">Go to {isWishlistFlow ? 'Wishlist' : 'Library'}</span>
                                <span className="text-xs ">View your collection</span>
                            </div>
                        </Button>

                        <Button
                            variant="secondary"
                            className="flex flex-col items-center gap-3 py-6 h-auto text-center"
                            onClick={() => router.push(`/game/${newGameId}`)}
                            disabled={!newGameId}
                        >
                            <ArrowRightIcon className="w-8 h-8 text-primary" />
                            <div className="flex flex-col gap-1">
                                <span className="font-bold ">View Details</span>
                                <span className="text-xs ">Edit notes, rating</span>
                            </div>
                        </Button>

                        <Button
                            variant="primary"
                            className="flex flex-col items-center gap-3 py-6 h-auto text-center"
                            onClick={onClose}
                        >
                            <SearchIcon className="w-8 h-8 " />
                            <div className="flex flex-col gap-1">
                                <span className="font-bold ">Continue</span>
                                <span className="text-xs ">Scan more games</span>
                            </div>
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
}