import { HttpStatusCode } from "@/types/http";
import { generateAndFormatZodError, T_ZodErrorFormatted } from "./form";
import { ErrorMessage } from "@/types/error";
import { MysqlErrorCodes } from "@/types/db";
import { mysqlErDupEntryExtractValue } from "./error";
import { localDebug } from "./utils";

export type SuccessResponse<T> = {
    data: T;
    message: string;
    success: true;
};
export const buildSuccessResponse = <T>(message: string, data: T) => {
    const obj: SuccessResponse<T> = {
        data: data,
        message: message,
        success: true,
    };
    return Response.json(obj, {
        status: HttpStatusCode.OK_200,
    });
};

export type ErrorResponse<T> = {
    message: string;
    errors: T_ZodErrorFormatted<T>;
    success: false;
};
export const buildErrorResponse = <E>(
    message: string,
    errors: T_ZodErrorFormatted<E>,
    status: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR_500,
) => {
    const obj: ErrorResponse<E> = {
        message: message,
        errors: errors,
        success: false,
    };
    return Response.json(obj, {
        status,
    });
};

export type ResponseJson<T, E = unknown> = Promise<
    SuccessResponse<T> | ErrorResponse<E>
>;

// fetch catch error return to ensure consistency
export const fetchErrorSomethingWentWrong: ErrorResponse<{}> = {
    success: false,
    message: ErrorMessage.SomethingWentWrong,
    errors: {
        unknown: ErrorMessage.SomethingWentWrong,
    },
};

// Frequently used error responses
export const buildNoBearerTokenErrorResponse = () => {
    return buildErrorResponse(
        "Unauthorized, authorization token is missing or invalid",
        generateAndFormatZodError(
            "unknown",
            ErrorMessage.NoPermissionToPerformThisAction,
        ),
        HttpStatusCode.UNAUTHORIZED_401,
    );
};

export const buildNoPermissionErrorResponse = () => {
    return buildErrorResponse(
        ErrorMessage.NoPermissionToPerformThisAction,
        generateAndFormatZodError(
            "unknown",
            ErrorMessage.NoPermissionToPerformThisAction,
        ),
        HttpStatusCode.FORBIDDEN_403,
    );
};

export const checkErrorForResponse = (
    error: any,
): {
    message: string;
    code: HttpStatusCode;
} => {
    switch (error.code) {
        case MysqlErrorCodes.ER_DUP_ENTRY:
            return {
                message: `${mysqlErDupEntryExtractValue(error)} already exists!`,
                code: HttpStatusCode.CONFLICT_409,
            };
        case MysqlErrorCodes.ER_ROW_IS_REFERENCED_2:
            return {
                message:
                    "Cannot delete this record because it is being referenced by another record.",
                code: HttpStatusCode.CONFLICT_409,
            };
        default:
            return {
                message: ErrorMessage.SomethingWentWrong,
                code: HttpStatusCode.INTERNAL_SERVER_ERROR_500,
            };
    }
};

export const checkAndBuildErrorResponse = (message: string, error: any) => {
    const { message: errorMessage, code: httpStatusCode } =
        checkErrorForResponse(error);

    localDebug(error, "checkAndBuildErrorResponse (come from api)");

    return buildErrorResponse(
        message,
        generateAndFormatZodError("unknown", errorMessage),
        httpStatusCode,
    );
};
