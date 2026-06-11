import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PlaythroughSection } from './PlaythroughSection';
import Providers from '@/components/Providers';

describe('PlaythroughSection Integration', () => {
    it('completes full lifecycle: add -> modal draft -> save -> card', async () => {
        render(
            <Providers>
                <PlaythroughSection gameId="game-1" initialPlaythroughs={[]} />
            </Providers>
        );

        fireEvent.click(screen.getByText(/Playthroughs/i));

        fireEvent.click(await screen.findByText(/Add Playthrough/i));

        await waitFor(() => {
            expect(screen.getByText(/System Log \/\/ Playthrough/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTitle('Save Log'));

        await waitFor(() => {
            expect(screen.queryByText(/System Log \/\/ Playthrough/i)).not.toBeInTheDocument();
            expect(screen.getAllByText('Queue').length).toBeGreaterThan(0);
        });
    });
});