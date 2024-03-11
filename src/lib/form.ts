import z from "zod";

export const generateZodError = (path: string, message: string): z.ZodError => {
    return new z.ZodError([
        {
            path: [path],
            message: message,
            code: "custom",
        },
    ]);
};

export type T_ZodErrorFormatted<T> = Partial<Record<keyof T, string>>;

// read docs to see schema https://zod.dev/?id=error-handling
export const formatZodError = <T>(
    error: z.ZodError,
): T_ZodErrorFormatted<T> => {
    let formattedError = {} as T_ZodErrorFormatted<T>;
    for (const issue of error.issues) {
        formattedError = {
            ...formattedError,
            [issue.path[0]]: issue.message,
        };
    }
    return formattedError;
};

export const generateAndFormatZodError = <T>(
    path: string,
    message: string,
): T_ZodErrorFormatted<T> => {
    return formatZodError(generateZodError(path, message));
};

export type ActionResult<T> = {
    errors: T_ZodErrorFormatted<T> | null;
};
