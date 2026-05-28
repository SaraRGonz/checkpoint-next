import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { DashboardClient } from "./DashboardClient";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

type DbGameResult = {
    id: string;
    title: string;
    status: string;
    rating: number | null;
    releaseYear: number | null;
    addedAt: Date;
    updatedAt: Date;
    platform: { name: string } | null;
    genres: { name: string }[];
};

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    const gamesData = await db.game.findMany({
        where: { userId: session.user.id },
        include: { platform: true, genres: true }
    });

    const allGames = gamesData.map((game) => ({
        ...game,
        status: game.status.charAt(0) + game.status.slice(1).toLowerCase(),
        platform: game.platform?.name || '',
        genres: game.genres.map((g) => g.name) || []
    }));
    
    const libraryGames = allGames.filter((g) => g.status !== 'Wishlist');

    const ratedGames = allGames.filter((g) => typeof g.rating === 'number' && g.rating > 0);

    const genreCounts = libraryGames.flatMap((g) => g.genres || []).reduce((acc: Record<string, number>, val: string) => {
        if (val) acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const platformCounts = libraryGames.reduce((acc: Record<string, number>, g) => {
        if (g.platform) acc[g.platform] = (acc[g.platform] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const completed = libraryGames.filter((g) => g.status === 'Completed').length;
    const completionRate = libraryGames.length > 0 ? Math.round((completed / libraryGames.length) * 100) : 0;

    const releaseYears = libraryGames.map((g) => g.releaseYear).filter((y): y is number => typeof y === 'number' && !isNaN(y));
    const avgYear = releaseYears.length > 0 ? Math.round(releaseYears.reduce((a: number, b: number) => a + b, 0) / releaseYears.length) : 0;
    const temporalFocus = avgYear > 0 ? `${Math.floor(avgYear / 10) * 10}s` : 'Unknown';

    const stats = {
        avgRating: ratedGames.length > 0 
            ? (ratedGames.reduce((acc: number, g) => acc + (g.rating || 0), 0) / ratedGames.length).toFixed(1)
            : "0.0",
        topGenre: Object.keys(genreCounts).length > 0
            ? Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0][0]
            : 'None',
        topPlatform: Object.keys(platformCounts).length > 0
            ? Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0][0]
            : 'None',
        completionRate: `${completionRate}%`,
        temporalFocus,
        activeThreads: allGames.filter((g) => g.status === 'Playing').length.toString()
    };

    return (
        <main className="min-h-screen py-10 px-4 md:px-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-150 h-150 bg-tertiary/5 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-0 left-0 w-125 h-125 bg-primary/5 blur-[120px] rounded-full -z-10" />
            
            <DashboardClient session={session} stats={stats} />
        </main>
    );
}