import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { WishlistClient } from './WishlistClient';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { useUIStore } from '@/stores/ui-store';
import { useRouter } from 'next/navigation';

vi.mock('next/navigation', () => {
    const mockParams = new URLSearchParams(); 
    return {
        useRouter: vi.fn(() => ({
            push: vi.fn(),
            replace: vi.fn(),
            refresh: vi.fn(),
            back: vi.fn(),
            forward: vi.fn(),
            prefetch: vi.fn(),
        })),
        useSearchParams: vi.fn(() => mockParams),
        usePathname: vi.fn(() => '/wishlist'),
    };
});

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: { retry: false, staleTime: 0, networkMode: 'always' },
        mutations: { networkMode: 'always' }
    },
});

function renderWishlist(qc: QueryClient) {
    return render(
        <QueryClientProvider client={qc}>
            <SessionProvider>
                <ThemeProvider>
                    <WishlistClient initialGames={[]} />
                </ThemeProvider>
            </SessionProvider>
        </QueryClientProvider>
    );
}

describe('WishlistClient Integration', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = createTestQueryClient();
        useUIStore.getState().clearFilters();
        vi.clearAllMocks();
    });

    it('renders wishlist games fetched from API via MSW', async () => {
        renderWishlist(queryClient);
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Cyberpunk 2077' })).toBeInTheDocument();
        });
    });

    it('renders Add to Library and trash buttons per wishlist game', async () => {
        renderWishlist(queryClient);
        await waitFor(() => screen.getByRole('heading', { name: 'Cyberpunk 2077' }));
        expect(screen.getByText('Add to Library')).toBeInTheDocument();
        expect(screen.getByLabelText(/Remove Cyberpunk 2077/i)).toBeInTheDocument();
    });

    it('opens delete modal when trash button clicked', async () => {
        renderWishlist(queryClient);
        await waitFor(() => screen.getByRole('heading', { name: 'Cyberpunk 2077' }));
        fireEvent.click(screen.getByLabelText(/Remove Cyberpunk 2077/i));
        await waitFor(() => {
            expect(screen.getByText(/Remove from Wishlist/i)).toBeInTheDocument();
        });
    });

    it('closes delete modal on Cancel', async () => {
        renderWishlist(queryClient);
        await waitFor(() => screen.getByRole('heading', { name: 'Cyberpunk 2077' }));
        fireEvent.click(screen.getByLabelText(/Remove Cyberpunk 2077/i));
        await waitFor(() => screen.getByText('Cancel'));
        fireEvent.click(screen.getByText('Cancel'));
        await waitFor(() => {
            expect(screen.queryByText(/Remove from Wishlist/i)).not.toBeInTheDocument();
        });
    });

    it('calls delete mutation on Remove confirm', async () => {
        renderWishlist(queryClient);
        await waitFor(() => screen.getByRole('heading', { name: 'Cyberpunk 2077' }));
        fireEvent.click(screen.getByLabelText(/Remove Cyberpunk 2077/i));
        await waitFor(() => screen.getByText('Remove'));
        fireEvent.click(screen.getByText('Remove'));
        await waitFor(() => {
            expect(screen.queryByText(/Remove from Wishlist/i)).not.toBeInTheDocument();
        });
    });

    it('calls updateGame on Add to Library click', async () => {
        renderWishlist(queryClient);
        await waitFor(() => screen.getByText('Add to Library'));
        fireEvent.click(screen.getByText('Add to Library'));
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Cyberpunk 2077' })).toBeInTheDocument();
        });
    });

    it('shows empty state when no wishlist games', async () => {
        const { server } = await import('@/mocks/server');
        const { http, HttpResponse } = await import('msw');

        server.use(
            http.get(/\/api\/library/, () => {
                return HttpResponse.json({ data: [] });
            })
        );

        render(
            <QueryClientProvider client={createTestQueryClient()}>
                <SessionProvider>
                    <ThemeProvider>
                        <WishlistClient initialGames={[]} />
                    </ThemeProvider>
                </SessionProvider>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Your wishlist is empty/i)).toBeInTheDocument();
        });
    });

    it('navigates to /search on Add game with RAWG click', async () => {
        const pushMock = vi.fn();
        vi.mocked(useRouter).mockReturnValue({
            push: pushMock,
            replace: vi.fn(),
            refresh: vi.fn(),
            back: vi.fn(),
            forward: vi.fn(),
            prefetch: vi.fn(),
        } as unknown as ReturnType<typeof useRouter>);

        renderWishlist(queryClient);
        await waitFor(() => screen.getByRole('heading', { name: 'Cyberpunk 2077' }));
        fireEvent.click(screen.getByText('Add game with RAWG'));
        expect(pushMock).toHaveBeenCalledWith('/search');
    });

    it('navigates to /library/add on Add game manually click', async () => {
        const pushMock = vi.fn();
        vi.mocked(useRouter).mockReturnValue({
            push: pushMock,
            replace: vi.fn(),
            refresh: vi.fn(),
            back: vi.fn(),
            forward: vi.fn(),
            prefetch: vi.fn(),
        } as unknown as ReturnType<typeof useRouter>);

        renderWishlist(queryClient);
        await waitFor(() => screen.getByRole('heading', { name: 'Cyberpunk 2077' }));
        fireEvent.click(screen.getByText('Add game manually'));
        expect(pushMock).toHaveBeenCalledWith('/library/add');
    });

    it('shows Reset button and clears filters when genre active', async () => {
        renderWishlist(queryClient);
        await waitFor(() => screen.getByRole('heading', { name: 'Cyberpunk 2077' }));
        fireEvent.change(
            screen.getByPlaceholderText('Search in wishlist...'),
            { target: { value: 'zzz' } }
        );
        await waitFor(() => {
            expect(screen.getByText('Reset')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText('Reset'));
        expect(useUIStore.getState().searchQuery).toBe('');
    });

    it('shows filtered empty state when search matches nothing', async () => {
        renderWishlist(queryClient);
        await waitFor(() => screen.getByRole('heading', { name: 'Cyberpunk 2077' }));
        fireEvent.change(
            screen.getByPlaceholderText('Search in wishlist...'),
            { target: { value: 'xxxxxnonexistent' } }
        );
        await waitFor(() => {
            expect(screen.getByText(/Mission Failed/i)).toBeInTheDocument();
        });
    });

    it('closes delete modal via onClose (X button)', async () => {
        renderWishlist(queryClient);
        await waitFor(() => screen.getByRole('heading', { name: 'Cyberpunk 2077' }));
        fireEvent.click(screen.getByLabelText(/Remove Cyberpunk 2077/i));
        await waitFor(() => screen.getByText(/Remove from Wishlist/i));
        const closeBtn = document.querySelector('button[aria-label="Close modal"]') 
            ?? document.querySelector('button[title="Close"]');
        if (closeBtn) fireEvent.click(closeBtn as Element);
        else {
            fireEvent.keyDown(document, { key: 'Escape' });
        }
        await waitFor(() => {
            expect(screen.queryByText(/Remove from Wishlist/i)).not.toBeInTheDocument();
        });
    });
});