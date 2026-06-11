import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PlaythroughCard } from './PlaythroughCard';
import type { Playthrough } from '@/types/playthrough';

const mockPlaythrough: Playthrough = {
    id: 'p1',
    gameId: 'game-1',
    status: 'Queue',
    startDate: '2024-01-01T00:00:00.000Z',
    rating: 4,
    notes: 'Good game',
    characterName: 'Geralt',
    serverName: 'TestServer',
    platform: { id: 'plat1', name: 'PC' }
};

const longNotesPlaythrough: Playthrough = {
    ...mockPlaythrough,
    notes: 'A'.repeat(200),
    characterName: null,
    serverName: null,
};

describe('PlaythroughCard', () => {
    it('renders card with status badge', () => {
        render(<PlaythroughCard playthrough={mockPlaythrough} onUpdate={vi.fn()} onDelete={vi.fn()} />);
        expect(screen.getAllByText('Queue')[0]).toBeInTheDocument();
    });

    it('renders platform, characterName, serverName', () => {
        render(<PlaythroughCard playthrough={mockPlaythrough} onUpdate={vi.fn()} onDelete={vi.fn()} />);
        expect(screen.getByText(/PC/)).toBeInTheDocument();
        expect(screen.getAllByText('Geralt')[0]).toBeInTheDocument();
        expect(screen.getAllByText('TestServer')[0]).toBeInTheDocument();
    });

    it('truncates long notes with Show more', () => {
        render(<PlaythroughCard playthrough={longNotesPlaythrough} onUpdate={vi.fn()} onDelete={vi.fn()} />);
        expect(screen.getByText(/Show more/i)).toBeInTheDocument();
    });

    it('opens modal on card click', async () => {
        render(<PlaythroughCard playthrough={mockPlaythrough} onUpdate={vi.fn()} onDelete={vi.fn()} />);
        fireEvent.click(screen.getAllByText('Queue')[0].closest('div')!);
        await waitFor(() => {
            expect(screen.getByText(/System Log/i)).toBeInTheDocument();
        });
    });

    it('enters edit mode on edit button click', async () => {
        render(<PlaythroughCard playthrough={mockPlaythrough} onUpdate={vi.fn()} onDelete={vi.fn()} />);
        fireEvent.click(screen.getAllByText('Queue')[0].closest('div')!);
        await waitFor(() => screen.getByTitle('Edit Log'));
        fireEvent.click(screen.getByTitle('Edit Log'));
        expect(screen.getByTitle('Save Log')).toBeInTheDocument();
    });

    it('calls onUpdate when save clicked', async () => {
        const onUpdate = vi.fn();
        render(<PlaythroughCard playthrough={mockPlaythrough} onUpdate={onUpdate} onDelete={vi.fn()} />);
        fireEvent.click(screen.getAllByText('Queue')[0].closest('div')!);
        await waitFor(() => screen.getByTitle('Edit Log'));
        fireEvent.click(screen.getByTitle('Edit Log'));
        fireEvent.click(screen.getByTitle('Save Log'));
        expect(onUpdate).toHaveBeenCalledOnce();
    });

    it('opens delete confirm modal', async () => {
        render(<PlaythroughCard playthrough={mockPlaythrough} onUpdate={vi.fn()} onDelete={vi.fn()} />);
        fireEvent.click(screen.getAllByText('Queue')[0].closest('div')!);
        await waitFor(() => screen.getByTitle('Edit Log'));
        fireEvent.click(screen.getByTitle('Edit Log'));
        fireEvent.click(screen.getByTitle('Delete Log'));
        await waitFor(() => {
            expect(screen.getByText(/Confirm Deletion/i)).toBeInTheDocument();
        });
    });

    it('calls onDelete when purge confirmed', async () => {
        const onDelete = vi.fn();
        render(<PlaythroughCard playthrough={mockPlaythrough} onUpdate={vi.fn()} onDelete={onDelete} />);
        fireEvent.click(screen.getAllByText('Queue')[0].closest('div')!);
        await waitFor(() => screen.getByTitle('Edit Log'));
        fireEvent.click(screen.getByTitle('Edit Log'));
        fireEvent.click(screen.getByTitle('Delete Log'));
        await waitFor(() => screen.getByText('Purge'));
        fireEvent.click(screen.getByText('Purge'));
        expect(onDelete).toHaveBeenCalledOnce();
    });

    it('opens modal on re-render when isNew toggles to true', async () => {
        const { rerender } = render(<PlaythroughCard playthrough={mockPlaythrough} onUpdate={vi.fn()} onDelete={vi.fn()} isNew={false} />);
        rerender(<PlaythroughCard playthrough={mockPlaythrough} onUpdate={vi.fn()} onDelete={vi.fn()} isNew={true} />);
        
        await waitFor(() => {
            expect(screen.getByText(/System Log/i)).toBeInTheDocument();
        });
    });

    it('discard on close when isNew and not saved calls onDelete', async () => {
        const onDelete = vi.fn();
        const { rerender } = render(<PlaythroughCard playthrough={mockPlaythrough} onUpdate={vi.fn()} onDelete={onDelete} isNew={false} />);
        rerender(<PlaythroughCard playthrough={mockPlaythrough} onUpdate={vi.fn()} onDelete={onDelete} isNew={true} />);
        
        await waitFor(() => screen.getByTitle('Discard Changes'));
        fireEvent.click(screen.getByTitle('Discard Changes'));
        expect(onDelete).toHaveBeenCalledOnce();
    });

    it('edits characterName input in modal', async () => {
        render(<PlaythroughCard playthrough={mockPlaythrough} onUpdate={vi.fn()} onDelete={vi.fn()} />);
        fireEvent.click(screen.getAllByText('Queue')[0].closest('div')!);
        await waitFor(() => screen.getByTitle('Edit Log'));
        fireEvent.click(screen.getByTitle('Edit Log'));
        const input = screen.getByPlaceholderText('Subject ID...');
        fireEvent.change(input, { target: { value: 'Ciri' } });
        expect(input).toHaveValue('Ciri');
    });

    it('edits serverName input in modal', async () => {
        render(<PlaythroughCard playthrough={mockPlaythrough} onUpdate={vi.fn()} onDelete={vi.fn()} />);
        fireEvent.click(screen.getAllByText('Queue')[0].closest('div')!);
        await waitFor(() => screen.getByTitle('Edit Log'));
        fireEvent.click(screen.getByTitle('Edit Log'));
        const input = screen.getByPlaceholderText('Connect to node...');
        fireEvent.change(input, { target: { value: 'EU-West' } });
        expect(input).toHaveValue('EU-West');
    });

    it('edits notes textarea in modal', async () => {
        render(<PlaythroughCard playthrough={mockPlaythrough} onUpdate={vi.fn()} onDelete={vi.fn()} />);
        fireEvent.click(screen.getAllByText('Queue')[0].closest('div')!);
        await waitFor(() => screen.getByTitle('Edit Log'));
        fireEvent.click(screen.getByTitle('Edit Log'));
        const textarea = screen.getByPlaceholderText('> Initialize manual log entry...');
        fireEvent.change(textarea, { target: { value: 'New notes' } });
        expect(textarea).toHaveValue('New notes');
    });

    it('shows view mode fields when not editing', async () => {
        render(<PlaythroughCard playthrough={mockPlaythrough} onUpdate={vi.fn()} onDelete={vi.fn()} />);
        fireEvent.click(screen.getAllByText('Queue')[0].closest('div')!);
        await waitFor(() => screen.getByTitle('Edit Log'));
        
        expect(screen.getAllByText('Geralt').length).toBeGreaterThan(0);
        expect(screen.getAllByText('TestServer').length).toBeGreaterThan(0);
        expect(screen.getByPlaceholderText('> No entries found.')).toBeInTheDocument();
    });

    it('shows N/A and Offline when characterName/serverName null in view mode', async () => {
        const p: Playthrough = { ...mockPlaythrough, characterName: null, serverName: null, notes: null };
        render(<PlaythroughCard playthrough={p} onUpdate={vi.fn()} onDelete={vi.fn()} />);
        fireEvent.click(screen.getAllByText('Queue')[0].closest('div')!);
        await waitFor(() => screen.getByTitle('Edit Log'));
        
        expect(screen.getByText('N/A')).toBeInTheDocument();
        expect(screen.getByText('Offline')).toBeInTheDocument();
    });

    it('abort button closes delete modal without deleting', async () => {
        const onDelete = vi.fn();
        render(<PlaythroughCard playthrough={mockPlaythrough} onUpdate={vi.fn()} onDelete={onDelete} />);
        fireEvent.click(screen.getAllByText('Queue')[0].closest('div')!);
        await waitFor(() => screen.getByTitle('Edit Log'));
        fireEvent.click(screen.getByTitle('Edit Log'));
        fireEvent.click(screen.getByTitle('Delete Log'));
        await waitFor(() => screen.getByText('Abort'));
        fireEvent.click(screen.getByText('Abort'));
        expect(onDelete).not.toHaveBeenCalled();
        expect(screen.queryByText(/Confirm Deletion/i)).not.toBeInTheDocument();
    });

    it('hides base card layout in draft mode to prevent UI flash', () => {
        render(<PlaythroughCard playthrough={mockPlaythrough} onUpdate={vi.fn()} onDelete={vi.fn()} isNew={true} />);
        
        expect(screen.getByText(/System Log/i)).toBeInTheDocument();
        
        const queueElements = screen.getAllByText('Queue');
        expect(queueElements).toHaveLength(1); 
    });
});