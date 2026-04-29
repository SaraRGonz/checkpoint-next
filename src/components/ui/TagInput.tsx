'use client'

import { useState } from 'react';
import { Badge } from './Badge';

interface Props {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
}

export function TagInput({ tags, onChange, placeholder = "Add genre and press enter" }: Props) {
    const [input, setInput] = useState('');

    const addTag = () => {
        const trimmed = input.trim();
        if (trimmed) {
            const formattedTag = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
            
            if (!tags.includes(formattedTag)) {
                onChange([...tags, formattedTag]);
            }
            
            setInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter(t => t !== tagToRemove));
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1.5 mb-1">
                {tags.map(tag => (
                    <div key={tag} className="group relative">
                        <Badge variant="default">{tag}</Badge>
                        <button 
                            type="button" 
                            onClick={() => removeTag(tag)}
                            className="absolute -top-1 -right-1 bg-danger text-text rounded-full w-3.5 h-3.5 text-[8px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >✕</button>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                onBlur={addTag}
                placeholder={placeholder}
                className="bg-gray-950 border border-gray-700 text-text text-xs placeholder:text-gray-300 p-2 rounded w-full outline-none focus:border-primary transition-colors"
            />
        </div>
    );
}