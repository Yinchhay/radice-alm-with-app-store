import { media, MediaFile } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { count, eq, like, sql } from "drizzle-orm";
import { editMediaSchema } from "@/app/api/internal/media/schema";
import { z } from "zod";

export const createMedia = async (mediaValue: typeof media.$inferInsert) => {
    return await db.insert(media).values(mediaValue);
};

export const getAllMedias = async () => {
    return await db.query.media.findMany({
        columns: {
            createdAt: false,
            updatedAt: false,
        },
    });
};

export const getMedias = async (
    page: number = 1,
    rowsPerPage: number = ROWS_PER_PAGE,
    search: string = "",
) => {
    return await db.query.media.findMany({
        where: (table, { like }) => like(table.title, `%${search}%`),
        limit: rowsPerPage,
        offset: (page - 1) * rowsPerPage,
        orderBy: sql`id DESC`,
    });
};

export const getMediasTotalRow = async (search: string = "") => {
    const totalRows = await db
        .select({ count: count() })
        .from(media)
        .where(like(media.title, `%${search}%`));
    return totalRows[0].count;
};

export const getMediaById = async (mediaId: number) => {
    return await db.query.media.findFirst({
        where: eq(media.id, mediaId),
    });
};

export const deleteMediaById = async (mediaId: number) => {
    return await db.delete(media).where(eq(media.id, mediaId));
};

export const editMediaById = async (
    mediaId: number,
    mediaValue: z.infer<typeof editMediaSchema>,
    mediaFiles: MediaFile[],
) => {
    return await db
        .update(media)
        .set({
            title: mediaValue.title,
            description: mediaValue.description,
            date: mediaValue.date,
            files: mediaFiles,
        })
        .where(eq(media.id, mediaId));
};
