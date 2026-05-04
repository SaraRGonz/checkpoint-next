import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Library',
    description: 'View and manage your entire video game collection.',
};

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}