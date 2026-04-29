'use client'

import { useDroppable } from '@dnd-kit/core';
import type { ReactNode } from 'react';

interface Props {
    status: string;
    label: string;
    count: number;
    children: ReactNode;
}

export function KanbanColumn({ status, label, count, children }: Props) {
    const { isOver, setNodeRef } = useDroppable({ id: status });

    return (
        <div 
            ref={setNodeRef} 
            className={`flex flex-col gap-4 p-4 rounded-xl border-2 transition-colors duration-200 h-full min-h-125 ${
                isOver ? 'border-primary bg-gray-800/80' : 'border-gray-800 bg-gray-900/40'
            }`}
        >
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <h3 className="font-black uppercase tracking-tighter text-gray-300">{label}</h3>
                <span className="bg-gray-800 text-xs font-bold px-2.5 py-0.5 rounded-full text-gray-400">
                    {count}
                </span>
            </div>
            <div className="flex flex-col gap-4 flex-1">
                {children}
            </div>
        </div>
    );
}