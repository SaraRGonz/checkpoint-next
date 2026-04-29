'use client'

import type { ReactNode } from 'react';
import { useActionMenu } from './ActionMenuContext';

interface Props {
    children: ReactNode;
    'aria-label'?: string;
}

export function ActionMenuOverlay({ children, 'aria-label': ariaLabel }: Props) {
    const { isOpen, position } = useActionMenu();

    if (!isOpen) return null;

    const positionClasses = position === 'top' 
        ? 'bottom-full mb-2 origin-bottom-left' 
        : 'top-full mt-2 origin-top-left';      

    return (
        <div
            className={`absolute z-50 w-full ${positionClasses} bg-gray-800 border border-gray-700 rounded-md shadow-xl outline-none animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto`}
            role="menu"
            aria-label={ariaLabel}
        >
            <div className="py-1" role="none">
                {children}
            </div>
        </div>
    );
}