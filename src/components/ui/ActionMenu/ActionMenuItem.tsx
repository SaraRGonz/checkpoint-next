'use client'

import type { ReactNode } from 'react';
import { useActionMenu } from './ActionMenuContext';
import { CheckIcon } from '@/components/ui/Icons';

interface Props {
    value: string;
    children: ReactNode;
    selected?: boolean;
}

export function ActionMenuItem({ value, children, selected }: Props) {
    const { selectedValue, onSelect, setIsOpen, searchQuery } = useActionMenu();
    const matches = children?.toString().toLowerCase().includes(searchQuery.toLowerCase());

    if (!matches && searchQuery !== '') return null;

    const isSelected = selected || selectedValue === value;

    const handleClick = () => {
        if (onSelect) onSelect(value);
        setIsOpen(false);
    };

    return (
        <button
            type="button"
            role="menuitem"
            onClick={handleClick}
            className="flex items-center w-full px-4 py-2.5 text-sm text-left transition-colors duration-150 text-gray-300 hover:bg-gray-700 hover:text-white group"
        >
            <span className="w-5 mr-2 flex justify-center items-center">
                {isSelected && (
                    <CheckIcon className="w-4 h-4 text-primary" />
                )}
            </span>
            <span className={isSelected ? 'font-medium text-white' : ''}>
                {children}
            </span>
        </button>
    );
}