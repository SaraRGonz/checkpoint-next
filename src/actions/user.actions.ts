'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const UpdateUserSchema = z.object({
    name: z.string().min(3, "ID must be at least 3 characters").optional(),
    image: z.string().url("Invalid image URL").or(z.literal('/placeholder.jpg')).optional(),
    imagePosition: z.string().optional(),
});

export async function updateUserProfileAction(data: { name?: string, image?: string, imagePosition?: string }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized access detected." };
        }

        const parsedData = UpdateUserSchema.parse(data);

        await db.user.update({
            where: { id: session.user.id },
            data: parsedData
        });

        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        return { success: false, error: "Database transaction failed." };
    }
}