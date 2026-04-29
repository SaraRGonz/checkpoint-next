'use client'

import type { Game } from '@/types/game'; 
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link'; 
import Image from 'next/image';

interface GameCardProps {
    game: Game; 
    showDetails?: boolean; 
    hideBadge?: boolean;
    disableLink?: boolean; 
    onClick?: () => void;
    compact?: boolean;
    priority?: boolean;
}

export function GameCard({ 
    game, showDetails = true, hideBadge = false, disableLink = false, onClick, compact = false, priority = false
}: GameCardProps) {

    const MAX_GENRES = 2;
    let displayGenres = '';

    if (game.genres && game.genres.length > 0) {
        const visibleGenres = game.genres.slice(0, MAX_GENRES);
        displayGenres = visibleGenres.join(', ');
        if (game.genres.length > MAX_GENRES) displayGenres += '...';
    }

    const hoverEffects = disableLink 
            ? (onClick ? "cursor-pointer hover:border-primary transition-colors" : "") 
            : "hover:border-primary hover:shadow-xl hover:shadow-primary/5 group";

    const containerClasses = `flex ${compact ? 'flex-row h-20' : 'flex-col h-full'} 
        bg-gray-900 border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 ${hoverEffects}`;    

    const cardContent = compact ? (
        <>
            <div className="w-14 sm:w-16 shrink-0 relative bg-gray-950 overflow-hidden">
                <Image 
                    src={game.coverUrl || '/placeholder.jpg'} 
                    alt={game.title} 
                    fill
                    sizes="64px"
                    priority={priority}
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{ objectPosition: game.coverPosition || '50% 50%' }}
                />
            </div>
            <div className="flex flex-col grow justify-center p-3 gap-1 overflow-hidden">
                <h3 className="text-sm font-bold text-gray-100 leading-tight truncate" title={game.title}>
                    {game.title}
                </h3>
                {showDetails && (
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">
                            {game.platform || 'Not specified'}
                        </span>
                        {!hideBadge && (
                            <div className="scale-[0.8] origin-right">
                                <Badge variant={game.status}>{game.status}</Badge>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    ) : (
        <>
            <div className="relative aspect-3/4 overflow-hidden bg-gray-950">
                <Image 
                    src={game.coverUrl || '/placeholder.jpg'} 
                    alt={game.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={priority}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: game.coverPosition || '50% 50%' }} 
                />
                <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-transparent opacity-80" />
            </div>

            <div className="flex flex-col grow p-5 gap-1.5">
                <h3 className="text-lg font-bold text-gray-100 leading-tight truncate" title={game.title}>
                    {game.title}
                </h3>
                {showDetails && (
                    <p className="text-sm text-gray-400 truncate" title={game.genres?.join(', ')}>
                        {displayGenres}
                    </p>
                )}
                {showDetails && (
                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-800/50">
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest truncate max-w-[55%]">
                            {game.platform}
                        </span>
                        {!hideBadge && <Badge variant={game.status}>{game.status}</Badge>}
                    </div>
                )}
            </div>
        </>
    );

    if (disableLink) {
        return (
            <div className={containerClasses} onClick={onClick} role={onClick ? "button" : undefined}>
                {cardContent}
            </div>
        );
    }

    return (
        <Link href={`/game/${game.id}`} className={containerClasses}>
            {cardContent}
        </Link>
    );
}