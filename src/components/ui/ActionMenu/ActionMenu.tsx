'use client'

import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ActionMenuContext } from './ActionMenuContext';
import { ActionMenuButton } from './ActionMenuButton';
import { ActionMenuOverlay } from './ActionMenuOverlay';
import { ActionMenuItem } from './ActionMenuItem';
import { ActionMenuSearch } from './ActionMenuSearch';

interface ActionMenuProps {
    children: ReactNode;
    onSelect?: (value: string) => void;
    value?: string;
    position?: 'top' | 'bottom'; 
}

export function ActionMenu({ children, onSelect, value, position = 'bottom' }: ActionMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isOpen) setSearchQuery('');
    }, [isOpen]);

    return (
        <ActionMenuContext.Provider value={{ 
            isOpen, setIsOpen, onSelect, selectedValue: value, position,
            searchQuery, setSearchQuery 
        }}>
            <div className="relative inline-block text-left w-full" ref={menuRef}>
                {children}
            </div>
        </ActionMenuContext.Provider>
    );
}

ActionMenu.Button = ActionMenuButton;
ActionMenu.Overlay = ActionMenuOverlay;
ActionMenu.Item = ActionMenuItem;
ActionMenu.Search = ActionMenuSearch;