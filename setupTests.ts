import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { server } from './src/mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => '/library'
}));

vi.mock('next-auth/react', () => ({
    useSession: () => ({ data: { user: { id: 'runner-1', name: 'Runner' } }, status: 'authenticated' }),
    SessionProvider: ({ children }: any) => children
}));