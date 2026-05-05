'use client';

import { useState } from 'react';
import { formatDate } from '../../utils/formatters';

interface GameMetadataSectionProps {
    addedAt?: string;
    updatedAt?: string;
    rawgId?: number;
}

export function GameMetadataSection({ addedAt, updatedAt, rawgId }: GameMetadataSectionProps) {
    const [showMetadata, setShowMetadata] = useState(false);

    return (
        <div className="mt-6 pt-4 border-t border-gray-800/50">
            <button
                onClick={() => setShowMetadata(!showMetadata)}
                className="cursor-pointer flex items-center gap-2 text-[10px] font-bold text-gray-500 hover:text-gray-300 uppercase tracking-widest transition-colors outline-none"
            >
                <svg
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${showMetadata ? 'rotate-45 text-primary' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                {showMetadata ? 'Hide Info' : 'More Info'}
            </button>

            {showMetadata && (
                <div className="mt-4 space-y-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="flex justify-between items-center">
                        <span>Added:</span>
                        <span className="text-gray-400">{formatDate(addedAt)}</span>
                    </div>
                    {updatedAt && (
                        <div className="flex justify-between items-center">
                            <span>Updated:</span>
                            <span className="text-gray-400">{formatDate(updatedAt)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-800/30">
                        <span>Source:</span>
                        {rawgId ? (
                            <a 
                                href={`https://rawg.io/games/${rawgId}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-primary hover:underline italic font-normal text-xs tracking-normal"
                            >
                                REF: RAWG-{rawgId}
                            </a>
                        ) : (
                            <span className="italic font-normal text-xs tracking-normal opacity-50">Local Game</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
