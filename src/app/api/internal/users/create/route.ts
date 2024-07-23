import { formatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { createUser } from "@/repositories/users";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";
import { z } from "zod";
import { createUserFormSchema } from "../schema";
import { generatePassword } from "@/lib/utils";
import { sendMail } from "@/smtp/mail";

export type FetchCreateUser = {
    email: string;
    password: string;
};

const successMessage = "Create user successfully";
const unsuccessMessage = "Create user failed";

export async function POST(request: Request) {
    try {
        const requiredPermission = new Set([Permissions.CREATE_USERS]);
        const { errorNoBearerToken, errorNoPermission } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }
        let body: z.infer<typeof createUserFormSchema> = await request.json();
        body.password = generatePassword();
        const validationResult = createUserFormSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        body = validationResult.data;

        const createResult = await createUser(body);
        // if no row is affected, meaning that creating user failed
        if (createResult[0].affectedRows < 1) {
            throw new Error(ErrorMessage.SomethingWentWrong);
        }

        // remember in development, the email will be sent to default email (not the actual email user). check sendMail function in src/smtp/mail.ts
        // for faster wait time we can remove await here since we don't need to wait for the email to be sent, if u want mailResult then add await
        const mailResult = sendMail({
            subject: "Your Radice account has been created",
            to: body.email,
            text: `Welcome to Radice! Your account has been successfully created. Below are your account details: 
            <br />
            <br />
            Email: ${body.email}
            <br />
            Password: ${body.password}
            <br />
            <br />
            Please keep this information safe and do not share it with anyone.`,
        });

        // if want to do something when email is sent successfully
        // if (mailResult && mailResult.accepted.length > 0) {
        // }

        return buildSuccessResponse<FetchCreateUser>(successMessage, {
            email: body.email,
            password: body.password,
        });
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
