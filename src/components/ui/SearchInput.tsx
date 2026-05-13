'use client'

import { SearchIcon } from './Icons';
import { useUIStore } from '@/stores/ui-store';

interface SearchInputProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
}

export function SearchInput({ placeholder = 'Search game...', value, onChange }: SearchInputProps) {
    const store = useUIStore();

    const isControlled = value !== undefined && onChange !== undefined;
    const displayValue = isControlled ? value : store.searchQuery;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitizedValue = e.target.value.replace(/[<>]/g, "");
        if (isControlled) {
            onChange(sanitizedValue);
        } else {
            store.setSearchQuery(sanitizedValue);
        }
    };

    return (
        <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> 
                <SearchIcon className="h-5 w-5 text-searchinput-icon" />
            </div>
            <input
                type="text"
                maxLength={100}
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 bg-searchinput-bg placeholder-searchinput-placeholder focus:outline-none focus:placeholder-searchinput-focusplaceholder focus:border-searchinput-focusborder sm:text-sm transition duration-150 ease-in-out"
                placeholder={placeholder}
                value={displayValue}
                onChange={handleChange}
            />
        </div>
    );
}