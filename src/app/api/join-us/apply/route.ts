import { formatZodError, generateAndFormatZodError } from "@/lib/form";
import {
    buildErrorResponse,
    checkAndBuildErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { createApplicationForm, getApplicationFormByEmail } from "@/repositories/application_forms";
import { ErrorMessage } from "@/types/error";
import { HttpStatusCode } from "@/types/http";
import { z } from "zod";
import { createApplicationFormSchema, cvFileSchema } from "../schema";
import { uploadFiles } from "@/lib/file";
import { getUserByEmail } from "@/repositories/users";

export type FetchCreateApplicationForm = Record<string, never>;

const successMessage = "Create application form successfully";
const unsuccessMessage = "Create application form failed";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        // check if user sent a cvFile
        if (!formData.has("cvFile")) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "cvFile",
                    "Curriculum vitae file is required",
                ),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        let cv;
        const file = formData.get("cvFile") as File;
        // validate file for its type, size
        const cvValidationResult = cvFileSchema.safeParse({
            cv: file,
        });
        if (!cvValidationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(cvValidationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        const files = [file];
        const response = await uploadFiles(files, "");

        if (!response.success) {
            const errorMessage =
                response.errors[
                    Object.keys(
                        response.errors,
                    )[0] as keyof typeof response.errors
                ];
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError("unknown", errorMessage),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }
        cv = response.data.filenames[0];

        const body: z.infer<typeof createApplicationFormSchema> = {
            email: formData.get("email") as string,
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            reason: formData.get("reason") as string,
            cv: cv,
        };
        const validationResult = createApplicationFormSchema.safeParse(body);
        if (!validationResult.success) {
            return buildErrorResponse(
                unsuccessMessage,
                formatZodError(validationResult.error),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const existingApplicationForm = await getApplicationFormByEmail(body.email);
        if (existingApplicationForm) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "email",
                    "You have already applied to join us. Please wait for our response.",
                ),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const existingApprovedUser = await getUserByEmail(body.email);
        if (existingApprovedUser) {
            return buildErrorResponse(
                unsuccessMessage,
                generateAndFormatZodError(
                    "email",
                    "Email already exists",
                ),
                HttpStatusCode.BAD_REQUEST_400,
            );
        }

        const createResult = await createApplicationForm(body);
        // if no row is affected, meaning that creating applicationForm failed
        if (createResult[0].affectedRows < 1) {
            throw new Error(ErrorMessage.SomethingWentWrong);
        }

        return buildSuccessResponse<FetchCreateApplicationForm>(
            successMessage,
            {},
        );
    } catch (error: any) {
        return checkAndBuildErrorResponse(unsuccessMessage, error);
    }
}
