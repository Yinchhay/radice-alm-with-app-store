import { HttpStatusCode } from "@/types/http";
import { T_ZodErrorFormatted } from "./form";

export type SuccessResponse<T> = {
    data: T;
    message: string;
    success: true;
};
export const buildSuccessResponse = <T>(data: T, message: string) => {
    return Response.json(
        {
            data: data,
            message: message,
            success: true,
        } as SuccessResponse<T>,
        {
            status: HttpStatusCode.OK_200,
        },
    );
};

export type ErrorResponse<T> = {
    message: string;
    errors: T_ZodErrorFormatted<T>;
    success: false;
};
export const buildErrorResponse = <T>(
    message: string,
    errors: T_ZodErrorFormatted<T>,
    status: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR_500,
) => {
    return Response.json(
        {
            message: message,
            errors: errors,
            success: false,
        } as ErrorResponse<T>,
        {
            status,
        },
    );
};

export type ResponseJson<T, E = unknown> = Promise<
    SuccessResponse<T> | ErrorResponse<E>
>;

// Frequently used error responses
export const buildNoBearerTokenErrorResponse = () => {
    return buildErrorResponse(
        "Unauthorized, authorization header is missing or invalid",
        {},
        HttpStatusCode.UNAUTHORIZED_401,
    );
};

export const buildNoPermissionErrorResponse = () => {
    return buildErrorResponse(
        "Unauthorized, you don't have permission to access this route",
        {},
        HttpStatusCode.FORBIDDEN_403,
    );
};
