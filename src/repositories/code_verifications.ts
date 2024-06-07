import { getRandom8DigitCode } from "@/lib/generate";
import { and, eq } from "drizzle-orm";
import { codeVerifications, CodeVerificationType } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";

export const getVerificationCodeByUserIdAndType = async (
    userId: string,
    type: CodeVerificationType,
) => {
    return await db.query.codeVerifications.findFirst({
        where: (table, { and, eq }) =>
            and(eq(table.userId, userId), eq(table.type, type)),
    });
};

export const verifyCodeByCodeAndType = async (
    code: string,
    type: CodeVerificationType,
    email: string,
) => {
    return await db.transaction(async (tx) => {
        const codeVerification = await tx.query.codeVerifications.findFirst({
            with: {
                user: {
                    columns: {
                        email: true,
                    },
                },
            },
            where: (table, { and, eq }) =>
                and(eq(table.code, code), eq(table.type, type)),
        });

        if (!codeVerification) {
            return {
                success: false,
                message: "Verification code not found",
            };
        }

        if (!isWithinExpirationDate(codeVerification.expiresAt)) {
            return {
                success: false,
                message: "Verification code is expired",
            };
        }

        if (codeVerification.user.email !== email) {
            return {
                success: false,
                message: "The email does not match the verification code",
            };
        }

        await tx
            .delete(codeVerifications)
            .where(
                and(
                    eq(codeVerifications.userId, codeVerification.userId),
                    eq(codeVerifications.type, type),
                ),
            );

        return {
            success: true,
            message: "Verification code is valid",
        };
    });
};

export async function generateVerificationCode(
    userId: string,
    type: CodeVerificationType,
): Promise<string> {
    return await db.transaction(async (tx) => {
        const eightDigitCode = getRandom8DigitCode();
        await tx
            .delete(codeVerifications)
            .where(
                and(
                    eq(codeVerifications.userId, userId),
                    eq(codeVerifications.type, type),
                ),
            );

        await tx.insert(codeVerifications).values({
            // expire 5min
            expiresAt: createDate(new TimeSpan(5, "m")),
            userId,
            type,
            code: eightDigitCode,
        });

        return eightDigitCode;
    });
}
