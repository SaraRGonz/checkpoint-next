'use client';

import Image from 'next/image';
import type { Game } from '../../types/game';
import { EditIcon } from '../ui/Icons';

interface GameCoverColumnProps {
    draft: Game;
    isEditing: boolean;
    onOpenImageModal: () => void; 
}

export function GameCoverColumn({ draft, isEditing, onOpenImageModal }: GameCoverColumnProps) {
    return (
        <div className="relative group flex flex-col justify-center h-full bg-gray-900/40 p-4 rounded-2xl border border-gray-800">
            <div className="relative rounded-2xl overflow-hidden border-2 border-gray-800 shadow-2xl aspect-3/4 group">
                <Image 
                    src={draft.coverUrl} 
                    alt={draft.title} 
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover" 
                    style={{ objectPosition: draft.coverPosition || '50% 50%' }} 
                />
                
                {isEditing && (
                    <button 
                        onClick={onOpenImageModal}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors duration-300 cursor-pointer z-10"
                    >
                        <div className="bg-primary p-3 rounded-full shadow-lg transform transition-transform duration-200 group-hover:scale-110">
                            <EditIcon className="w-6 h-6 text-background" />
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
}