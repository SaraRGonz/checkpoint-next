'use client';

import { useState } from 'react';
import { ChevronDownIcon, PlusIcon } from '../ui/Icons';
import { PlaythroughCard } from './PlaythroughCard';
import { usePlaythroughs } from '@/hooks/usePlaythroughs';
import type { Playthrough } from '@/types/playthrough';

interface Props {
    gameId: string;
    initialPlaythroughs: Playthrough[];
}

export function PlaythroughSection({ gameId, initialPlaythroughs }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [autoOpenId, setAutoOpenId] = useState<string | null>(null);
    const { playthroughs, addPlaythrough, updatePlaythrough, deletePlaythrough } = usePlaythroughs(initialPlaythroughs, gameId);

    const handleAdd = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isOpen) setIsOpen(true);
        try {
            const newP = await addPlaythrough();
            setAutoOpenId(newP.id);
        } catch (error) {}
    };

    return (
        <div className="w-full mt-8 border border-gray-800 rounded-2xl bg-gray-900/20 overflow-hidden">
            <div 
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-800/50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h2 className="text-xl font-bold uppercase tracking-widest text-text flex items-center gap-2">
                    Playthroughs <span className="text-xs bg-gray-800 px-2 py-1 rounded-full text-gray-400">{playthroughs.length}</span>
                </h2>
                <ChevronDownIcon className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
            </div>
            
            {isOpen && (
                <div className="p-6 border-t border-gray-800 space-y-6 animate-in slide-in-from-top-4 fade-in duration-300">
                    <button 
                        onClick={handleAdd}
                        className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:text-white transition-colors cursor-pointer outline-none"
                    >
                        <PlusIcon className="w-5 h-5" /> Add Playthrough
                    </button>
                    
                    {playthroughs.length === 0 ? (
                        <p className="text-gray-500 text-sm italic">No logs yet. Start your first adventure.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                            {playthroughs.map(p => (
                                <PlaythroughCard 
                                    key={p.id} 
                                    playthrough={p} 
                                    onUpdate={(updates) => updatePlaythrough(p.id, updates)}
                                    onDelete={() => deletePlaythrough(p.id)}
                                    isNew={autoOpenId === p.id}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}