import { medias } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { count, eq, sql } from "drizzle-orm";
import { editMediaSchema } from "@/app/api/internal/media/schema";
import { z } from "zod";

export const createMedia = async (media: typeof medias.$inferInsert) => {
    return await db.insert(medias).values(media);
};

export const getMedias = async (
    page: number = 1,
    rowsPerPage: number = ROWS_PER_PAGE,
    search: string = "",
) => {
    return await db.query.medias.findMany({
        where: (table, { like }) => like(table.title, `%${search}%`),
        limit: rowsPerPage,
        offset: (page - 1) * rowsPerPage,
        orderBy: sql`id DESC`,
    });
};

export const getMediasTotalRow = async () => {
    const totalRows = await db.select({ count: count() }).from(medias);
    return totalRows[0].count;
};

export const getMediaById = async (mediaId: number) => {
    return await db.query.medias.findFirst({
        where: eq(medias.id, mediaId),
    });
};

export const deleteMediaById = async (mediaId: number) => {
    return await db.delete(medias).where(eq(medias.id, mediaId));
};

export const editMediaById = async (
    mediaId: number,
    media: z.infer<typeof editMediaSchema>,
) => {
    return await db
        .update(medias)
        .set({
            title: media.title,
            description: media.description,
            date: media.date,
        })
        .where(eq(medias.id, mediaId));
};
