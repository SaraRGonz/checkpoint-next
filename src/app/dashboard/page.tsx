import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const gamesData = await db.game.findMany({
        include: { platform: true, genres: true }
    });

    const allGames = gamesData.map(game => ({
        ...game,
        status: game.status.charAt(0) + game.status.slice(1).toLowerCase(),
        platform: game.platform?.name || '',
        genres: game.genres.map(g => g.name) || []
    }));
    
    // INSIGHTS
    const genreCounts = allGames.flatMap(g => g.genres || []).reduce<Record<string, number>>((acc, val) => {
        if (val) acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});

    const platformCounts = allGames.reduce<Record<string, number>>((acc, g) => {
        if (g.platform) acc[g.platform] = (acc[g.platform] || 0) + 1;
        return acc;
    }, {});

    const completed = allGames.filter(g => g.status === 'Completed').length;
    const completionRate = allGames.length > 0 ? Math.round((completed / allGames.length) * 100) : 0;

    const releaseYears = allGames.map(g => g.releaseYear).filter((y): y is number => typeof y === 'number' && !isNaN(y));
    const avgYear = releaseYears.length > 0 ? Math.round(releaseYears.reduce((a, b) => a + b, 0) / releaseYears.length) : 0;
    const temporalFocus = avgYear > 0 ? `${Math.floor(avgYear / 10) * 10}s` : 'Unknown';

    const stats = {
        avgRating: allGames.length > 0 
            ? (allGames.reduce((acc, g) => acc + (g.rating || 0), 0) / allGames.length).toFixed(1)
            : "0.0",
        topGenre: Object.keys(genreCounts).length > 0
            ? Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0][0]
            : 'None',
        topPlatform: Object.keys(platformCounts).length > 0
            ? Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0][0]
            : 'None',
        completionRate: `${completionRate}%`,
        temporalFocus,
        activeThreads: allGames.filter(g => g.status === 'Playing').length.toString()
    };

    return (
        <main className="min-h-screen py-10 px-4 md:px-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-150 h-150 bg-tertiary/5 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-0 left-0 w-125 h-125 bg-primary/5 blur-[120px] rounded-full -z-10" />
            
            <DashboardClient session={session} stats={stats} />
        </main>
    );
}