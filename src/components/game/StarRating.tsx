'use client';

import { StarIcon } from '../ui/Icons';

interface StarRatingProps {
    rating: number;
    maxStars?: number; 
    onChange?: (rating: number) => void; 
    disabled?: boolean; 
}


export function StarRating({ rating, maxStars = 5, onChange, disabled = false }: StarRatingProps) { 
    
    const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

    return (
        <div className="flex gap-1 items-center">
            {stars.map((starNumber) => {
                
                const isFilled = starNumber <= rating;

                return (
                    <StarIcon
                        key={starNumber}
                        onClick={() => !disabled && onChange?.(starNumber)}
                        className={`w-5 h-5 ${isFilled ? 'text-filledstar fill-current' : 'text-emptystar fill-current'} ${!disabled && onChange ? 'cursor-pointer hover:scale-110' : ''}`}
                    />
                );
            })}
        </div>
    );
}