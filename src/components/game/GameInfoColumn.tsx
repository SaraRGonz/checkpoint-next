'use client';

import { EditableInfoRow } from './EditableInfoRow';
import { StarRating } from './StarRating';
import { TagInput } from '../ui/TagInput';
import { ActionMenu } from '../ui/ActionMenu/ActionMenu';
import { PLATFORM_LIST, STATUS_LIST } from '../../utils/constants';
import type { Game, GameStatus } from '../../types/game';
import { GameMetadataSection } from './GameMetadataSection';

interface GameInfoColumnProps {
    draft: Game;
    isEditing: boolean;
    updateDraftField: (field: keyof Game, value: any) => void;
}

export function GameInfoColumn({ draft, isEditing, updateDraftField }: GameInfoColumnProps) {
    return (
        <div className="h-full bg-gray-900/40 p-6 rounded-2xl border border-gray-800 space-y-6">
            <div className="space-y-4">
                {/* PLATFORM con ActionMenu */}
                <EditableInfoRow label="Platform" isEditing={isEditing} valueDisplay={draft.platform}>
                    <ActionMenu value={draft.platform} onSelect={(val) => updateDraftField('platform', val)}>
                        <ActionMenu.Button>{draft.platform}</ActionMenu.Button>
                        <ActionMenu.Overlay>

                            <ActionMenu.Search />
                            
                            {PLATFORM_LIST.map(p => (
                                <ActionMenu.Item key={p} value={p}>{p}</ActionMenu.Item>
                            ))}
                        </ActionMenu.Overlay>
                    </ActionMenu>
                </EditableInfoRow>

                {/* STATUS con ActionMenu */}
                <EditableInfoRow label="Status" isEditing={isEditing} valueDisplay={draft.status}>
                    <ActionMenu value={draft.status} onSelect={(val) => updateDraftField('status', val as GameStatus)}>
                        <ActionMenu.Button>{draft.status}</ActionMenu.Button>
                        <ActionMenu.Overlay>
                            {STATUS_LIST.map(s => (
                                <ActionMenu.Item key={s.value} value={s.value}>{s.label}</ActionMenu.Item>
                            ))}
                        </ActionMenu.Overlay>
                    </ActionMenu>
                </EditableInfoRow>

                {/* GENRES con TagInput */}
                <EditableInfoRow label="Genres" isEditing={isEditing} valueDisplay={draft.genres?.join(', ')}>
                    <TagInput 
                        tags={draft.genres || []} 
                        onChange={(newTags) => updateDraftField('genres', newTags)} 
                    />
                </EditableInfoRow>
                
                {/* RELEASE YEAR */}
                <EditableInfoRow label="Release" isEditing={isEditing} valueDisplay={draft.releaseYear}>
                    <input 
                        type="number"
                        value={draft.releaseYear || ''}
                        onChange={(e) => updateDraftField('releaseYear', parseInt(e.target.value))}
                        className="bg-gray-950 border border-gray-700 text-white text-sm p-2 rounded w-full outline-none focus:border-primary"
                    />
                </EditableInfoRow>
            </div>

            {/* RATING */}
            <div className="pt-2 flex justify-between items-center">
                <label className="text-[11px] font-bold text-gray-300 uppercase tracking-widest mt-1">Rating:</label>
                <StarRating 
                    rating={draft.rating || 0} 
                    onChange={(r) => updateDraftField('rating', r)}
                    disabled={!isEditing}
                />
            </div>
            
            {/* METADATA */}
            <GameMetadataSection 
                addedAt={draft.addedAt} 
                updatedAt={draft.updatedAt} 
                rawgId={draft.rawgId} 
            />

        </div>
    );
}