'use client';

import { useState } from 'react';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { StarRating } from './StarRating';
import { EditIcon, TrashIcon, SaveIcon, CrossIcon } from '../ui/Icons';
import { ActionMenu } from '../ui/ActionMenu/ActionMenu';
// import { PLATFORM_LIST } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';
import type { Playthrough, PlaythroughStatus } from '@/types/playthrough';

const P_STATUS: PlaythroughStatus[] = ['Queue', 'Playing', 'Completed', 'Dropped'];

interface Props {
    playthrough: Playthrough;
    onUpdate: (updates: Partial<Playthrough>) => void;
    onDelete: () => void;
    isNew?: boolean;
}

export function PlaythroughCard({ playthrough, onUpdate, onDelete, isNew }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(playthrough);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);

    const [prevIsNew, setPrevIsNew] = useState(isNew);

    if (isNew !== prevIsNew) {
        setPrevIsNew(isNew);
        if (isNew && !hasSaved) {
            setDraft(playthrough);
            setIsModalOpen(true);
            setIsEditing(true);
        }
    }

    const updateDraft = <K extends keyof Playthrough>(key: K, val: Playthrough[K]) => {
        setDraft(prev => ({ ...prev, [key]: val }));
    };
    
    const save = () => {
        setHasSaved(true);
        onUpdate({ 
            status: draft.status, 
            platformName: draft.platform?.name || null, 
            rating: draft.rating, 
            notes: draft.notes,
            characterName: draft.characterName,
            serverName: draft.serverName
        });
        setIsEditing(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        if (isNew && !hasSaved) {
            onDelete();
        } else {
            setDraft(playthrough); 
        }
    };

    const isNotesLong = (playthrough.notes?.length || 0) > 150;

    return (
        <>
            <div 
                onClick={() => { setDraft(playthrough); setIsModalOpen(true); }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-4 shadow-sm relative group cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(var(--color-primary),0.1)] hover:-translate-y-1"
            >
                <div className="flex justify-between items-start">
                    <Badge variant={playthrough.status}>{playthrough.status}</Badge>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{formatDate(playthrough.startDate)}</p>
                    </div>
                </div>

                {playthrough.platform?.name && (
                    <p className="text-sm text-gray-400">Platform: <span className="text-gray-200">{playthrough.platform.name}</span></p>
                )}

                {playthrough.rating !== null && playthrough.rating !== undefined && (
                    <StarRating rating={playthrough.rating} disabled />
                )}

                {(playthrough.characterName || playthrough.serverName) && (
                    <div className="flex flex-wrap gap-2">
                        {playthrough.characterName && (
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-1 rounded">
                                {// Character name
                                }
                                {playthrough.characterName}
                            </span>
                        )}
                        {playthrough.serverName && (
                            <span className="text-xs font-bold text-purple-400 bg-purple-400/10 border border-purple-400/20 px-2 py-1 rounded">
                                {// Server name
                                }
                                {playthrough.serverName}
                            </span>
                        )}
                    </div>
                )}

                {playthrough.notes && (
                    <div className="text-sm text-gray-300 wrap-break-word mt-2">
                        {isNotesLong ? (
                            <>
                                {playthrough.notes.substring(0, 150)}...
                                <span className="text-primary text-xs font-bold uppercase ml-2 tracking-wider group-hover:underline">Show more</span>
                            </>
                        ) : (
                            playthrough.notes
                        )}
                    </div>
                )}
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                title="System Log // Playthrough"
                variant="cyberpunk"
            >
                <div className="animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-between items-center border-b border-primary/20 pb-4 mb-6">
                        <div className="flex gap-2">
                            {isEditing ? (
                                <div className="w-40">
                                    <ActionMenu value={draft.status} onSelect={(val) => updateDraft('status', val as PlaythroughStatus)}>
                                        <ActionMenu.Button>{draft.status}</ActionMenu.Button>
                                        <ActionMenu.Overlay>
                                            {P_STATUS.map(s => <ActionMenu.Item key={s} value={s}>{s}</ActionMenu.Item>)}
                                        </ActionMenu.Overlay>
                                    </ActionMenu>
                                </div>
                            ) : <Badge variant={playthrough.status}>{playthrough.status}</Badge>}
                        </div>
                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <button onClick={() => setIsDeleteModalOpen(true)} className="p-2 bg-danger/20 text-danger rounded-md hover:bg-danger/40 transition border border-danger/50" title="Delete Log"><TrashIcon className="w-5 h-5"/></button>
                                    <button onClick={handleCloseModal} className="p-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition border border-gray-600" title="Discard Changes"><CrossIcon className="w-5 h-5"/></button>
                                    <button onClick={save} className="p-2 bg-primary/20 text-primary rounded-md hover:bg-primary/40 transition border border-primary/50" title="Save Log"><SaveIcon className="w-5 h-5"/></button>
                                </>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="p-2 bg-gray-900 text-primary rounded-md hover:bg-primary/20 hover:text-white transition cursor-pointer border border-primary/30" title="Edit Log"><EditIcon className="w-5 h-5"/></button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-4 space-y-6 bg-gray-950/80 p-6 rounded-xl border border-primary/10 shadow-inner">
                            <h3 className="text-xs uppercase tracking-[0.2em] text-primary/70 font-bold mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span> Network Data
                            </h3>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">Rating</label>
                                <div className="bg-black/40 p-3 rounded-lg border border-primary/10">
                                    <StarRating rating={draft.rating || 0} onChange={(r) => updateDraft('rating', r)} disabled={!isEditing} />
                                </div>
                            </div>

                            {/* PLATFORM SELECTOR

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">Platform / Hardware</label>
                                {isEditing ? (
                                    <ActionMenu 
                                        value={draft.platform?.name || 'Unknown Identity'} 
                                        onSelect={(val) => updateDraft('platform', val === 'Unknown Identity' ? null : { name: val })}
                                    >
                                        <ActionMenu.Button className="inline-flex w-full cursor-pointer items-center justify-between p-3 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 border border-primary/30 rounded-lg bg-black/60 text-primary hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
                                            {draft.platform?.name || 'Unknown Identity'}
                                        </ActionMenu.Button>
                                        <ActionMenu.Overlay>
                                            <ActionMenu.Search />
                                            <ActionMenu.Item value="Unknown Identity">Unknown Identity</ActionMenu.Item>
                                            {PLATFORM_LIST.map(p => (
                                                <ActionMenu.Item key={p} value={p}>{p}</ActionMenu.Item>
                                            ))}
                                        </ActionMenu.Overlay>
                                    </ActionMenu>
                                ) : (
                                    <div className="bg-black/40 p-3 rounded-lg border border-primary/10 text-sm text-gray-200">
                                        {playthrough.platform?.name || 'Unknown Identity'}
                                    </div>
                                )}
                            </div>

                            */}

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-emerald-400/70 font-bold">Character</label>
                                {isEditing ? (
                                    <input 
                                        value={draft.characterName || ''} 
                                        onChange={(e)=>updateDraft('characterName', e.target.value)} 
                                        className="w-full bg-black/60 border border-emerald-400/30 text-emerald-400 p-3 rounded-lg text-sm focus:border-emerald-400 outline-none transition-all placeholder-emerald-900"
                                        placeholder="Subject ID..."
                                    /> 
                                ) : (
                                    <div className="bg-black/40 p-3 rounded-lg border border-emerald-400/10 text-sm text-emerald-100">
                                        {playthrough.characterName || 'N/A'}
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest text-purple-400/70 font-bold">Run name / Server</label>
                                {isEditing ? (
                                    <input 
                                        value={draft.serverName || ''} 
                                        onChange={(e)=>updateDraft('serverName', e.target.value)} 
                                        className="w-full bg-black/60 border border-purple-400/30 text-purple-400 p-3 rounded-lg text-sm focus:border-purple-400 outline-none transition-all placeholder-purple-900"
                                        placeholder="Connect to node..."
                                    /> 
                                ) : (
                                    <div className="bg-black/40 p-3 rounded-lg border border-purple-400/10 text-sm text-purple-100">
                                        {playthrough.serverName || 'Offline'}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-8 flex flex-col h-full min-h-100">
                            <h3 className="text-xs uppercase tracking-[0.2em] text-primary/70 font-bold mb-4 flex items-center gap-2">
                                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                Encrypted Logs
                            </h3>
                            <textarea
                                value={draft.notes || ''}
                                onChange={(e) => updateDraft('notes', e.target.value)}
                                readOnly={!isEditing}
                                className={`grow w-full bg-black/60 border rounded-xl p-6 text-sm text-gray-300 resize-none outline-none transition-all shadow-inner font-mono ${isEditing ? 'border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-gray-950' : 'border-primary/10 cursor-default'}`}
                                placeholder={isEditing ? "> Initialize manual log entry..." : "> No entries found."}
                                spellCheck={false}
                            />
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion" footerButtons={[
                { content: 'Abort', variant: 'secondary', onClick: () => setIsDeleteModalOpen(false) },
                { content: 'Purge', variant: 'danger', onClick: () => { onDelete(); setIsDeleteModalOpen(false); setIsModalOpen(false); } }
            ]}>
                <p className="text-gray-300">Are you sure you want to permanently delete this system log? This action cannot be undone.</p>
            </Modal>
        </>
    );
}