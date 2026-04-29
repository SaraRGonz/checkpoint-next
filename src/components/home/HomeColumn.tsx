import type { ReactNode } from 'react';

interface HomeColumnProps {
    title: string;
    children: ReactNode;
}

export function HomeColumn({ title, children }: HomeColumnProps) {
    return (
        <section className="flex flex-col gap-6 group">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-500 group-hover:text-primary transition-colors duration-500 text-center">
                {title}
            </h2>

            <div className="flex flex-col gap-4 grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-500 ease-in-out h-full border border-gray-800 rounded-3xl p-6 bg-gray-900/20 group-hover:border-primary/30 shadow-2xl">
                {children}
            </div>
        </section>
    );
}