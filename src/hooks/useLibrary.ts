import { useContext } from 'react';
import { LibraryContext } from '@/context/LibraryContext';

export function useLibrary() {
    const context = useContext(LibraryContext);
    if (context === undefined) {
        throw new Error('useLibrary must be used within a LibraryProvider');
    }
    return context;
}