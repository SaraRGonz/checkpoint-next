import type { ReactNode } from 'react';
import type { GameStatus } from '@/types/game';

interface BadgeProps {
    children: ReactNode;
    variant?: GameStatus | 'default';
}

const variantStyles: Record<GameStatus | 'default', string> = {
    default: 'bg-badge-bgdefault text-badge-default',
    Wishlist: 'bg-badge-bgwishlist text-badge-wishlist',
    Queue: 'bg-badge-bgqueue text-badge-queue',
    Playing: 'bg-badge-bgplaying text-badge-playing',
    Completed: 'bg-badge-bgcompleted text-badge-completed',
    Dropped: 'bg-badge-bgdropped text-badge-dropped'
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
    const baseStyles = 'px-2.5 py-0.5 rounded-sm text-xs font-medium inline-block';
    const finalClasses = `${baseStyles} ${variantStyles[variant]}`;

    return (
        <span className={finalClasses}>
            {children}
        </span>
    );
}