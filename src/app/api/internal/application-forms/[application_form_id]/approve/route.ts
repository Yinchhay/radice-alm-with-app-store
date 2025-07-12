import { generateAndFormatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { generatePassword } from "@/lib/utils";
import { approveApplicationFormById } from "@/repositories/application_forms";
import { sendMail } from "@/smtp/mail";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";

// update type if we were to return any data back to the response
export type FetchApproveApplicationForm = Record<string, never>;

type Params = { params: { application_form_id: string } };
const successMessage = "Approve application form successfully";
const unsuccessMessage = "Approve application form failed";

export async function PATCH(request: Request, { params }: Params) {
    try {
        const requiredPermission = new Set([
            Permissions.APPROVE_AND_REJECT_APPLICATION_FORMS,
        ]);
        const { errorNoBearerToken, errorNoPermission, user } =
            await checkBearerAndPermission(request, requiredPermission);
        if (errorNoBearerToken) {
            return buildNoBearerTokenErrorResponse();
        }
        if (errorNoPermission) {
            return buildNoPermissionErrorResponse();
        }

        const generatedPw =
            process.env.NODE_ENV === "development"
                ? "12345678"
                : generatePassword();

        // during approve, we approve and return back the application form data
        const applicationForm = await approveApplicationFormById(
            Number(params.application_form_id),
            user.id,
            generatedPw,
        );
        if (!applicationForm) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "Failed to approve application form because it does not exist or the form status is not pending",
                ),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        // remember in development, the email will be sent to default email (not the actual email user). check sendMail function in src/smtp/mail.ts
        // for faster wait time we can remove await here since we don't need to wait for the email to be sent, if u want mailResult then add await
        const mailResult = sendMail({
            subject: "Radice application form approved",
            to: applicationForm.email,
            text: `Dear ${applicationForm.firstName} ${applicationForm.lastName}, we are pleased to inform you that your Radice application form has been approved. Here is your account credential that you can use to login to Radice: 
            <br />
            <br />
            Email: ${applicationForm.email}
            <br />
            Password: ${generatedPw}
            <br />
            <br />
            Please change your password after you login to Radice.`,
        });

        return buildSuccessResponse<FetchApproveApplicationForm>(
            successMessage,
            {},
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
