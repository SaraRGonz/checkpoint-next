import { MetadataRoute } from 'next';
import { getLibrary } from '@/api/library';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://checkpoint.vercel.app'; 

    const staticRoutes = ['', '/library', '/wishlist', '/search', '/library/add'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    try {
        const { data: games } = await getLibrary();

        const gameRoutes = games.map((game) => ({
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