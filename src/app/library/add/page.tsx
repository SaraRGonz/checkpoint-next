'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addGameAction } from '@/actions/library.actions';
import { Button } from '@/components/ui/Button';
import { TagInput } from '@/components/ui/TagInput';
import { ActionMenu } from '@/components/ui/ActionMenu/ActionMenu';
import { STATUS_LIST, PLATFORM_LIST } from '@/utils/constants';
import type { GameStatus } from '@/types/game';
import { PlusIcon, ArrowLeftIcon } from '@/components/ui/Icons';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';

const DEFAULT_COVER_URL = '/placeholder.jpg';

export default function AddGamePage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [title, setTitle] = useState('');
    const [coverUrl, setCoverUrl] = useState(DEFAULT_COVER_URL);
    const [coverPosition, setCoverPosition] = useState('50% 50%');
    const [platform, setPlatform] = useState('');
    const [status, setStatus] = useState<GameStatus>('Queue');
    const [releaseYear, setReleaseYear] = useState<number | ''>('');
    const [genres, setGenres] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const isValidUrl = (url: string) => {
        if (!url || url.trim() === '' || url === DEFAULT_COVER_URL) return true;
        try {
            const parsed = new URL(url);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e?: React.SyntheticEvent) => {
        if (e) e.preventDefault(); 

        if (title.trim() === '') {
            setError('The title is required.');
            return;
        }

        let finalCoverUrl = coverUrl.trim();
        if (finalCoverUrl !== DEFAULT_COVER_URL && !isValidUrl(finalCoverUrl)) {
            finalCoverUrl = DEFAULT_COVER_URL;
            setCoverUrl(DEFAULT_COVER_URL);
        }

        try {
            setIsSaving(true);
            setError(null);

            const result = await addGameAction({
                title,
                coverUrl: finalCoverUrl === '' ? DEFAULT_COVER_URL : finalCoverUrl,
                coverPosition,
                platform: platform === '' ? undefined : platform,
                status,
                releaseYear: releaseYear === '' ? undefined : releaseYear, 
                genres,
            });
            
            if (result.success && result.gameId) {
                queryClient.invalidateQueries({ queryKey: ['games'] });
                router.push(`/game/${result.gameId}`);
            } else {
                if (result.errors) {
                    const errorMessages = Object.values(result.errors).flat().join(', ');
                    setError(`Validation failed: ${errorMessages}`);
                } else {
                    setError(result.error || 'Failed to save the game. Please try again.');
                }
            }
            
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to save the game. Please try again.';
            setError(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            
            <header className="flex flex-col md:flex-row justify-between items-center border-b border-gray-800 pb-6 gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button 
                        onClick={() => router.back()}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors outline-none shrink-0"
                        title="Go back"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-text text-center md:text-left m-0 truncate">
                        ADD NEW GAME
                    </h1>
                </div>
                
                <div className="flex gap-2 shrink-0">
                    <Button onClick={handleSubmit} variant="primary" disabled={isSaving}>
                        <span className="flex items-center justify-center gap-2">
                            <PlusIcon className="w-5 h-5" />
                            {isSaving ? 'Creating...' : 'Create Game'}
                        </span>
                    </Button>
                </div>
            </header>

            {error && (
                <div className="bg-danger/10 border border-danger p-4 rounded-xl text-danger text-sm font-bold">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 items-stretch">
                
                <div className="relative flex flex-col justify-center h-full bg-gray-900/40 p-4 rounded-2xl border border-gray-800 shadow-xl min-w-0">
                    <div className="relative rounded-2xl overflow-hidden border-2 border-gray-800 shadow-2xl aspect-3/4 w-full bg-gray-950">
                        <Image 
                            src={isValidUrl(coverUrl) ? coverUrl : DEFAULT_COVER_URL} 
                            alt="Cover Preview" 
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            className="object-cover transition-opacity" 
                            style={{ objectPosition: coverPosition }}
                            onError={() => setCoverUrl(DEFAULT_COVER_URL)}
                        />
                    </div>
                    
                    <div className="mt-4 space-y-1.5">
                        <label className="text-[10px] uppercase text-gray-300 font-bold mb-3 tracking-[0.2em]">Cover URL</label>
                        <input 
                            type="text"
                            value={coverUrl === DEFAULT_COVER_URL ? '' : coverUrl}
                            onChange={(e) => {
                                setCoverUrl(e.target.value);
                                if (e.target.value.trim() !== '' && !isValidUrl(e.target.value)) {
                                    setError('Warning: The URL format is invalid. A placeholder will be used.');
                                } else if (error?.includes('Warning')) {
                                    setError(null);
                                }
                            }}
                            placeholder="https://..."
                            className="w-full bg-gray-950 border border-gray-700 text-gray-300 text-xs p-2 rounded outline-none focus:border-primary transition-colors placeholder:text-gray-300"
                        />
                    </div>

                    {coverUrl.trim() !== '' && coverUrl !== DEFAULT_COVER_URL && isValidUrl(coverUrl) && (
                        <div className="mt-6 space-y-4 pt-6 border-t border-gray-800">
                            {(() => {
                                const [x, y] = coverPosition.split(' ');
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
                                                onChange={(e) => setCoverPosition(`${e.target.value}% ${currentY}%`)}
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
                                                onChange={(e) => setCoverPosition(`${currentX}% ${e.target.value}%`)}
                                                className="w-full mt-2 accent-primary"
                                            />
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    )}
                </div>

                <div className="h-full bg-gray-900/40 p-8 rounded-2xl border border-gray-800 space-y-8 shadow-inner min-w-0">
                    
                    <div className="space-y-1.5 border-b border-gray-800 pb-6">
                        <label className="text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-1">Title</label>
                        <input 
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Baldur's Gate III"
                            className="w-full bg-transparent text-4xl font-black tracking-tighter text-gray-100 placeholder:text-gray-500 outline-none focus:border-primary border border-transparent focus:bg-gray-950 p-2 rounded-xl transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Platform</label>
                            <ActionMenu value={platform} onSelect={setPlatform}>
                                <ActionMenu.Button>{platform || 'Select Platform'}</ActionMenu.Button>
                                <ActionMenu.Overlay>
                                    <ActionMenu.Search />
                                    {PLATFORM_LIST.map(p => (
                                        <ActionMenu.Item key={p} value={p}>{p}</ActionMenu.Item>
                                    ))}
                                </ActionMenu.Overlay>
                            </ActionMenu>
                        </div>
                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Status</label>
                            <ActionMenu value={status} onSelect={(val) => setStatus(val as GameStatus)}>
                                <ActionMenu.Button>{status}</ActionMenu.Button>
                                <ActionMenu.Overlay>
                                    {STATUS_LIST.map(s => (
                                        <ActionMenu.Item key={s.value} value={s.value}>{s.label}</ActionMenu.Item>
                                    ))}
                                </ActionMenu.Overlay>
                            </ActionMenu>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full pt-4 border-t border-gray-800">
                        <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Release Year</label>
                        <input 
                            type="number"
                            value={releaseYear}
                            onChange={(e) => setReleaseYear(e.target.value === '' ? '' : parseInt(e.target.value))}
                            placeholder="e.g. 2022"
                            className="bg-gray-950 border border-gray-700 text-text text-sm p-3 rounded-lg w-full outline-none focus:border-primary transition-all placeholder:text-gray-300"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 w-full pt-4 border-t border-gray-800">
                        <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Genres</label>
                        <TagInput 
                            tags={genres} 
                            onChange={setGenres} 
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}