import { db } from "@/drizzle/db";
import { files } from "@/drizzle/schema";

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
                },
                // don't take any columns since we don't need project's attribute
                columns: {
                    userId: true,
                },
            },
        },
    });
};
