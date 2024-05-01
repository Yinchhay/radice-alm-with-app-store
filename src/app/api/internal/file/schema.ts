import { z } from "zod";

export const createFileFormSchema = z.object({
    files: z
        .any()
        .refine(
            (files: File[]) => {
                return (
                    Array.isArray(files) &&
                    files.every((file) => file instanceof File)
                );
            },
            {
                message:
                    "File is required and/or must be a file or an array of files",
            },
        )
        .refine(
            (files: File[]) => {
                // limit file size to 100MB
                const KB = 1024;
                const MB = KB * KB;
                const MAX_FILE_SIZE = 100 * MB;

                if (Array.isArray(files)) {
                    return files.every((file) => file.size <= MAX_FILE_SIZE);
                }
            },
            {
                message: "File size must be less than or equal 100MB",
            },
        ),
    projectId: z.number().nullable(),
});

export const deleteFileFormSchema = z.object({
    filename: z.string().min(1, {
        message: "Filename is required",
    }),
});