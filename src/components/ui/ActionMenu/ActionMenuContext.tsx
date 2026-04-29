'use client'

import { createContext, useContext } from 'react';

export interface ActionMenuContextProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onSelect?: (value: string) => void;
    selectedValue?: string;
    position?: 'top' | 'bottom'; 
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const ActionMenuContext = createContext<ActionMenuContextProps | undefined>(undefined);

export function useActionMenu() {
    const context = useContext(ActionMenuContext);
    if (!context) {
        throw new Error('ActionMenu sub-components must be used within the <ActionMenu> wrapper');
    }
    return context;
}