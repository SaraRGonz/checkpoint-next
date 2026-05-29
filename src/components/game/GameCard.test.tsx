import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameCard } from './GameCard';
import type { Game } from '@/types/game';

const baseGame: Game = {
    id: 'g1',
    title: 'The Witcher 3',
    coverUrl: '/witcher.jpg',
    status: 'Playing',
    platform: 'PC',
    genres: ['RPG', 'Action', 'Adventure'],
};

describe('GameCard', () => {
    it('renders title', () => {
        render(<GameCard game={baseGame} />);
        expect(screen.getAllByText('The Witcher 3')[0]).toBeInTheDocument();
    });

    it('truncates genres beyond MAX_GENRES with ellipsis', () => {
        render(<GameCard game={baseGame} />);
        expect(screen.getByText('RPG, Action...')).toBeInTheDocument();
    });

    it('shows all genres when <= MAX_GENRES', () => {
        const game = { ...baseGame, genres: ['RPG', 'Action'] };
        render(<GameCard game={game} />);
        expect(screen.getAllByText('RPG, Action')[0]).toBeInTheDocument();
    });

    it('renders as Link by default', () => {
        const { container } = render(<GameCard game={baseGame} />);
        expect(container.querySelector('a[href="/game/g1"]')).toBeInTheDocument();
    });

    it('renders as div with onClick when disableLink=true', () => {
        const onClick = vi.fn();
        const { container } = render(<GameCard game={baseGame} disableLink onClick={onClick} />);
        expect(container.querySelector('a')).toBeNull();
        const div = container.querySelector('[role="button"]')!;
        fireEvent.click(div);
        expect(onClick).toHaveBeenCalledOnce();
    });

    it('renders compact layout', () => {
        const { container } = render(<GameCard game={baseGame} compact />);
        expect(container.firstChild).toHaveClass('flex-row');
    });

    it('hides badge when hideBadge=true', () => {
        render(<GameCard game={baseGame} hideBadge />);
        expect(screen.queryByText('Playing')).toBeNull();
    });

    it('shows placeholder when no coverUrl', () => {
        const game = { ...baseGame, coverUrl: '' };
        const { container } = render(<GameCard game={game} />);
        expect(container.querySelector('img')).toBeInTheDocument();
    });

    it('shows Not specified when no platform in compact mode', () => {
        const game = { ...baseGame, platform: undefined };
        render(<GameCard game={game} compact />);
        expect(screen.getByText('Not specified')).toBeInTheDocument();
    });

    it('renders disableLink without onClick (no role=button)', () => {
        const { container } = render(<GameCard game={baseGame} disableLink />);
        expect(container.querySelector('[role="button"]')).toBeNull();
        expect(container.querySelector('a')).toBeNull();
    });
});