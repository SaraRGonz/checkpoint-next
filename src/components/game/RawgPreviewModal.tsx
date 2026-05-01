'use client'

import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import Image from 'next/image';
import type { Game } from '@/types/game';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    game: Game | null;
}

export function RawgPreviewModal({ isOpen, onClose, game }: Props) {
    if (!game) return null;

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Database Records"
            closeIconClassName="text-gray-400 hover:text-white transition-colors"
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="shrink-0 w-32 md:w-40 relative">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden border-2 border-gray-700 shadow-2xl bg-gray-950 relative w-full h-full">
                        <Image 
                            src={game.coverUrl || '/placeholder.jpg'} 
                            alt={game.title} 
                            fill
                            sizes="(max-width: 768px) 128px, 160px"
                            className="object-cover"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter text-white leading-tight">
                            {game.title}
                        </h3>
                        <p className="text-sm font-bold text-primary mt-1">
                            {game.releaseYear ? `Released in ${game.releaseYear}` : 'Release year unknown'}
                        </p>
                    </div>

                    {game.genres && game.genres.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Genres</p>
                            <div className="flex flex-wrap gap-2">
                                {game.genres.map(g => (
                                    <span key={g} className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded border border-gray-700">
                                        {g}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {game.availablePlatforms && game.availablePlatforms.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Available Platforms</p>
                            <div className="flex flex-wrap gap-2">
                                {game.availablePlatforms.map(p => (
                                    <Badge key={p} variant="Completed">{p}</Badge> 
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}