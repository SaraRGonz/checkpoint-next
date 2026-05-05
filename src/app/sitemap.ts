import { MetadataRoute } from 'next';
import { getAllGames } from '@/lib/library';
import { Game } from '@/types/game';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://checkpoint.vercel.app'; 

    const staticRoutes = ['', '/library', '/wishlist', '/search', '/library/add'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    try {
        const games: Game[] = await getAllGames();

        const gameRoutes = games.map((game: Game) => ({
            url: `${baseUrl}/game/${game.id}`,
            lastModified: game.updatedAt ? new Date(game.updatedAt) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }));

        return [...staticRoutes, ...gameRoutes];
    } catch (error) {
        console.error("Error generating sitemap for games:", error);
        return staticRoutes;
    }
}