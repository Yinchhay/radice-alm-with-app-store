import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    buildSomethingWentWrongErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { createPartner } from "@/repositories/partner";
import { MysqlErrorCodes } from "@/types/db";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { createPartnerFormSchema } from "../schema";
import { generatePassword } from "@/lib/utils";

export type FetchCreatePartner = {
    email: string;
    password: string;
}

const successMessage = "Create partner successfully";
const unsuccessMessage = "Create partner failed";

export async function POST(request: Request) {
    try {
        const requiredPermission = new Set([Permissions.CREATE_PARTNERS]);
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }
        let body: z.infer<typeof createPartnerFormSchema> =
            await request.json();
        body.password = generatePassword();

        const validationResult = createPartnerFormSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const createResult = await createPartner(body);
        // if no row is affected, meaning that creating partner failed
        if (createResult[0].affectedRows < 1) {
            throw new Error(ErrorMessage.SomethingWentWrong);
        }

        if (process.env.NODE_ENV === "production") {
            // TODO: send email to partner's email in production

        }

        return buildSuccessResponse<FetchCreatePartner>(successMessage, {
            email: body.email,
            password: body.password,
        });
    } catch (error: any) {
        if (error.code === MysqlErrorCodes.ER_DUP_ENTRY) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "email",
                    // remember try to make message clear, in this case only email has unique constraint
                    "Partner email already exists",
                ),
                HttpStatusCode.CONFLICT_409,
            );
        }

        return buildSomethingWentWrongErrorResponse(unsuccessMessage);
    }
}
