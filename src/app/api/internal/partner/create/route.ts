import { formatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { createPartner } from "@/repositories/partner";

import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { createPartnerFormSchema } from "../schema";
import { generatePassword } from "@/lib/utils";
import { sendMail } from "@/smtp/mail";

export type FetchCreatePartner = {
    email: string;
    password: string;
};

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

        // remember in development, the email will be sent to default email (not the actual email user). check sendMail function in src/smtp/mail.ts
        const mailResult = await sendMail({
            subject: "Your Radice Account Has Been Created",
            // change to your email
            to: body.email,
            text: `Welcome to Radice! Your account has been successfully created. Below are your account details: \n\nEmail: ${body.email}\nPassword: ${body.password}\n\nPlease keep this information safe and do not share it with anyone.`,
        });

        // if want to do something when email is sent successfully
        // if (mailResult && mailResult.accepted.length > 0) {
        // }

        return buildSuccessResponse<FetchCreatePartner>(successMessage, {
            email: body.email,
            password: body.password,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
