import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Radar Search',
    description: 'Search the RAWG database for new games to add to your collection.',
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}