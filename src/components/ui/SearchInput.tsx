'use client'

import { SearchIcon } from './Icons';

interface SearchInputProps {
    value: string;
    onChange: (newValue: string) => void;
    placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search game...' }: SearchInputProps) {
    return (
        <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> 
                <SearchIcon className="h-5 w-5 text-searchinput-icon" />
            </div>
            
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 bg-searchinput-bg placeholder-searchinput-placeholder focus:outline-none focus:placeholder-searchinput-focusplaceholder focus:border-searchinput-focusborder sm:text-sm transition duration-150 ease-in-out"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}