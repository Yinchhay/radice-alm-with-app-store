import { MAX_FILE_SIZE } from "@/lib/file";
import { z } from "zod";

export const fileAnySchema = z
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
        if (Array.isArray(files)) {
            return files.every((file) => file.size <= MAX_FILE_SIZE);
        }
    },
    {
        message: "File size must be less than or equal 100MB",
    },
);
export const createFileFormSchema = z.object({
    files: fileAnySchema,
    projectId: z.number().nullable(),
});

export const deleteFileFormSchema = z.object({
    filename: z.string().min(1, {
        message: "Filename is required",
    }),
});