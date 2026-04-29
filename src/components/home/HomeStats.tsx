import type { GameStatus } from '@/types/game';

interface StatData {
    status: GameStatus | string;
    percentage: number;
}

interface HomeStatsProps {
    total: number;
    stats: StatData[];
}

export function HomeStats({ total, stats }: HomeStatsProps) {
    return (
        <div className="h-full flex flex-col justify-center gap-8">
            <div className="text-center border-b border-gray-800 pb-6">
                <span className="text-5xl font-black text-text">{total}</span>
                <p className="text-[10px] uppercase tracking-[0.3em] text-text">Total Library</p>
            </div>

            <div className="space-y-6">
                {stats.map(({ status, percentage }) => (
                    <div key={status} className="space-y-2">
                        <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-text">
                            <span>{status}</span>
                            <span>{percentage}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-950 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-1000"
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}