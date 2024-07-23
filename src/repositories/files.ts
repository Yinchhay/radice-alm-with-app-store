import { db } from "@/drizzle/db";
import { files } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const createFile = async (file: typeof files.$inferInsert) => {
    return await db.insert(files).values(file);
};

export const getFileByFilename = async (filename: string) => {
    return await db.query.files.findFirst({
        where: (file, { eq }) => eq(file.filename, filename),
        with: {
            project: {
                with: {
                    projectMembers: true,
                    projectPartners: true,
                },
            },
        },
    });
};

export const deleteFileByFilename = async (filename: string) => {
    return await db.delete(files).where(eq(files.filename, filename));
};
