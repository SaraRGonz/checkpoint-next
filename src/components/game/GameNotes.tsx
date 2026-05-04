'use client';

interface GameNotesProps {
    notes: string;
    onChange: (notes: string) => void;
    isEditing: boolean;
    onDoubleClick?: () => void; 
}

export function GameNotes({ notes, onChange, isEditing, onDoubleClick }: GameNotesProps) {
    return (
        <div className="flex flex-col h-full bg-gray-900/40 p-6 rounded-2xl border border-gray-800 shadow-inner">
            <h3 className="text-xl font-bold mb-4 uppercase tracking-widest text-secondary">
                Notes
            </h3>
            
            <textarea
                value={notes}
                onChange={(e) => onChange(e.target.value)}
                onDoubleClick={onDoubleClick} 
                readOnly={!isEditing} 
                placeholder={isEditing ? "Log your thoughts on this adventure..." : "Looks like you haven't written anything here yet. Double click to start writing!"}
                className={`grow w-full bg-gray-950/50 border rounded-xl p-4 text-gray-300 resize-none outline-none transition-all min-h-62.5 ${
                    isEditing 
                    ? 'border-primary focus:ring-1 focus:ring-primary focus:border-primary' 
                    : 'border-transparent cursor-pointer' 
                }`}
            />
        </div>
    );
}