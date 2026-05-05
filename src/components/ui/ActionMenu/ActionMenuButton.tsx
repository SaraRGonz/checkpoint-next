'use client'

import type { ReactNode } from 'react';
import { useActionMenu } from './ActionMenuContext';
import { ChevronDownIcon } from '@/components/ui/Icons';

interface Props {
    children: ReactNode;
}

export function ActionMenuButton({ children }: Props) {
    const { isOpen, setIsOpen } = useActionMenu();

    return (
        <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex w-full cursor-pointer items-center justify-between px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 border rounded-md bg-gray-900 border-gray-700 text-gray-300 hover:border-primary hover:text-white focus:outline-none focus:ring-1 focus:ring-primary"
        >
            <span className="truncate">{children}</span>
            <ChevronDownIcon className="w-4 h-4 ml-2 shrink-0 text-gray-500" />
        </button>
    );
}