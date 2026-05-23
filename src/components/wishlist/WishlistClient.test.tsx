import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { WishlistClient } from './WishlistClient';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/context/ThemeContext';
import { SessionProvider } from 'next-auth/react';
import { useUIStore } from '@/stores/ui-store';

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false, 
            staleTime: 0,
            networkMode: 'always' 
        },
        mutations: {
            networkMode: 'always'
        }
    },
});

describe('WishlistClient Integration', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = createTestQueryClient();
        useUIStore.getState().clearFilters(); 
    });

    it('renders wishlist games fetched from API via MSW', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <SessionProvider>
                    <ThemeProvider>
                        <WishlistClient initialGames={[]} />
                    </ThemeProvider>
                </SessionProvider>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Cyberpunk 2077' })).toBeInTheDocument();
        });
    });
});