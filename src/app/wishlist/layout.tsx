import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Wishlist',
    description: 'Track the games you want to play next.',
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}