'use client'

import { useActionMenu } from './ActionMenuContext';
import { SearchIcon } from '@/components/ui/Icons'; 

export function ActionMenuSearch() {
    const { searchQuery, setSearchQuery } = useActionMenu();

    return (
        <div className="sticky top-0 z-10 bg-gray-800 p-2 border-b border-gray-700">
            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                    autoFocus
                    type="text"
                    className="w-full bg-gray-900 text-sm text-white pl-9 pr-4 py-2 rounded-md border border-gray-700 focus:outline-none transition-colors"
                    placeholder="Search filter..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()} 
                />
            </div>
        </div>
    );
}