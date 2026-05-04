interface Props {
    label: string;
    isEditing: boolean;
    children: React.ReactNode; 
    valueDisplay: string | number | undefined; 
}

export function EditableInfoRow({ label, isEditing, children, valueDisplay }: Props) {
    return (
        <div className={`flex justify-between items-start gap-4 border-b border-gray-800/50 py-4 min-h-12 transition-all duration-300 ${
            isEditing ? 'bg-gray-800/20 px-3 -mx-3 rounded-xl' : ''
        }`}>
            <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest shrink-0 mt-1">
                {label}:
            </span>

            {isEditing ? (
                <div className="grow max-w-55 animate-in zoom-in-95 duration-200">
                    {children}
                </div>
            ) : (
                <div className="text-sm font-bold text-gray-100 text-right leading-relaxed wrap-break-words max-w-[70%]">
                    {valueDisplay || <span className="text-gray-400 italic font-normal">Not specified</span>}
                </div>
            )}
        </div>
    );
}