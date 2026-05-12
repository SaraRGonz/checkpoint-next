import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs/promises';
import path from 'path';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Reading data from src/data/library.json...');
    const dataPath = path.join(process.cwd(), 'src', 'data', 'library.json');
    const fileData = await fs.readFile(dataPath, 'utf-8');
    const gamesMock = JSON.parse(fileData);

    console.log(`Seeding ${gamesMock.length} games into the Neon database...`);

    for (const game of gamesMock) {
        let platformRecord = await prisma.platform.findUnique({ where: { name: game.platform } });
        if (!platformRecord) {
            platformRecord = await prisma.platform.create({ data: { name: game.platform } });
        }

        const genreConnections = [];
        if (game.genres && game.genres.length > 0) {
            for (const genreName of game.genres) {
                let genreRecord = await prisma.genre.findUnique({ where: { name: genreName } });
                if (!genreRecord) {
                    genreRecord = await prisma.genre.create({ data: { name: genreName } });
                }
                genreConnections.push({ id: genreRecord.id });
            }
        }

        const mappedStatus = game.status ? game.status.toUpperCase() : 'QUEUE';

        await prisma.game.upsert({
            where: { id: game.id },
            update: {}, 
            create: {
                id: game.id,
                title: game.title,
                coverUrl: game.coverUrl,
                releaseYear: game.releaseYear,
                rawgId: game.rawgId,
                rating: game.rating,
                status: mappedStatus as any,
                addedAt: game.addedAt ? new Date(game.addedAt) : new Date(),
                updatedAt: game.updatedAt ? new Date(game.updatedAt) : undefined, 
                platformId: platformRecord.id,
                genres: {
                    connect: genreConnections
                }
            }
        });
    }

    console.log('Seed completed successfully. Database ready.');
}

main()
    .catch((e) => {
        console.error('Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });