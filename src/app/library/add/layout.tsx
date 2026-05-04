import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Add Game | Checkpoint',
    description: 'Manually add a new game to your Checkpoint library.',
};

export default function AddGameLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}