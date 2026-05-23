import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PlaythroughSection } from './PlaythroughSection';
import Providers from '@/components/Providers';

describe('PlaythroughSection Integration', () => {
    it('creates a new playthrough optimistically', async () => {
        render(
            <Providers>
                <PlaythroughSection gameId="game-1" initialPlaythroughs={[]} />
            </Providers>
        );

        const toggleBtn = screen.getByText(/Playthroughs/i);
        fireEvent.click(toggleBtn);

        const addBtn = await screen.findByText(/Add Playthrough/i);
        fireEvent.click(addBtn);

        await waitFor(() => {
            expect(screen.getByText('Queue')).toBeInTheDocument();
        });
    });
});