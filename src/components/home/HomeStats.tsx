import type { GameStatus } from '@/types/game';
import { LogoIcon, CheckIcon, KanbanIcon, CrossIcon } from '@/components/ui/Icons';

interface StatData {
    status: GameStatus | string;
    percentage: number;
}

interface HomeStatsProps {
    total: number;
    stats: StatData[];
}

const STATUS_CONFIG: Record<string, { icon: React.ElementType, color: string, bg: string }> = {
    'Playing': { icon: LogoIcon, color: 'var(--color-badge-playing)', bg: 'var(--color-badge-bgplaying)' },
    'Completed': { icon: CheckIcon, color: 'var(--color-badge-completed)', bg: 'var(--color-badge-bgcompleted)' },
    'Queue': { icon: KanbanIcon, color: 'var(--color-badge-queue)', bg: 'var(--color-badge-bgqueue)' },
    'Dropped': { icon: CrossIcon, color: 'var(--color-badge-dropped)', bg: 'var(--color-badge-bgdropped)' },
};

export function HomeStats({ total, stats }: HomeStatsProps) {
    return (
        <div className="h-full flex flex-col gap-6">
            
            <div className="relative group flex flex-col items-center justify-center p-6 border border-gray-800 bg-gray-900/40 rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary/50 shadow-inner">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500" />
                
                
                <span className="text-6xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-primary drop-shadow-[0_0_15px_rgba(14,165,233,0.4)]">
                    {total}
                </span>
                
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mt-2">
                    Total Library
                </p>
            </div>

            <div className="flex flex-col gap-5 grow justify-center mt-2">
                {stats.map(({ status, percentage }) => {
                    const config = STATUS_CONFIG[status] || { icon: KanbanIcon, color: 'var(--color-gray)', bg: '#334155' };
                    const Icon = config.icon;

                    return (
                        <div key={status} className="flex flex-col gap-2.5 group cursor-default">
                            <div className="flex justify-between items-end text-xs font-bold uppercase tracking-widest text-gray-400">
                                <div className="flex items-center gap-2">
                                    <div 
                                        className="w-6 h-6 rounded-md flex items-center justify-center border transition-all duration-500 group-hover:scale-110"
                                        style={{ 
                                            backgroundColor: config.bg, 
                                            borderColor: config.color, 
                                            color: config.color, 
                                            boxShadow: `0 0 10px ${config.color}30` // Glow sutil en el icono
                                        }}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="transition-colors duration-300 group-hover:text-white">
                                        {status}
                                    </span>
                                </div>
                                <span 
                                    className="transition-all duration-300"
                                    style={{ 
                                        color: config.color, 
                                        textShadow: `0 0 10px ${config.color}60` 
                                    }}
                                >
                                    {percentage}%
                                </span>
                            </div>

                            <div className="h-1.5 bg-gray-950 rounded-full overflow-hidden border border-gray-800/50">
                                <div
                                    className="h-full rounded-full transition-all duration-1000 ease-out relative"
                                    style={{ 
                                        width: `${percentage}%`, 
                                        backgroundColor: config.color,
                                        boxShadow: `0 0 10px ${config.color}, 0 0 20px ${config.color}80` // Doble glow neón
                                    }}
                                >
                                    <div className="absolute inset-0 bg-white/20 w-full animate-pulse" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}