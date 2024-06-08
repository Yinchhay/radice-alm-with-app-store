import { generateAndFormatZodError } from "@/lib/form";
import { checkBearerAndPermission } from "@/lib/IAM";
import {
    buildErrorResponse,
    buildNoBearerTokenErrorResponse,
    buildNoPermissionErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { rejectApplicationFormById } from "@/repositories/application_forms";
import { sendMail } from "@/smtp/mail";
import { HttpStatusCode } from "@/types/http";
import { Permissions } from "@/types/IAM";

// update type if we were to return any data back to the response
export type FetchRejectApplicationForm = Record<string, never>;

type Params = { params: { application_form_id: string } };
const successMessage = "Reject application form successfully";
const unsuccessMessage = "Reject application form failed";

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

        // during reject, we reject and return back the application form details
        const applicationForm = await rejectApplicationFormById(
            Number(params.application_form_id),
            user.id,
        );
        if (!applicationForm) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "unknown",
                    "Failed to reject application form because it does not exist or the form status is not pending",
                ),
                HttpStatusCode.NOT_FOUND_404,
            );
        }

        // remember in development, the email will be sent to default email (not the actual email user). check sendMail function in src/smtp/mail.ts
        // for faster wait time we can remove await here since we don't need to wait for the email to be sent, if u want mailResult then add await
        const mailResult = sendMail({
            subject: "Radice application form rejected",
            to: applicationForm.email,
            text: `Dear ${applicationForm.firstName} ${applicationForm.lastName}, we regret to inform you that your Radice application form has been rejected.`,
        });

        return buildSuccessResponse<FetchRejectApplicationForm>(
            successMessage,
            {},
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
