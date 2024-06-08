import {
    applicationForms,
    ApplicationFormStatus,
    users,
} from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { and, count, eq, sql } from "drizzle-orm";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "@/lib/IAM";
import { UserType } from "@/types/user";

export const createApplicationForm = async (
    form: typeof applicationForms.$inferInsert,
) => {
    return await db.insert(applicationForms).values({
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        reason: form.reason,
        cv: form.cv,
    });
};

export const getApplicationFormByEmail = async (email: string) => {
    return await db.query.applicationForms.findFirst({
        where: (table, { eq }) => eq(table.email, email),
    });
};

export const getApplicationForms = async (
    page: number = 1,
    rowsPerPage: number = ROWS_PER_PAGE,
) => {
    return await db.query.applicationForms.findMany({
        limit: rowsPerPage,
        offset: (page - 1) * rowsPerPage,
        orderBy: sql`id DESC`,
    });
};

export const getApplicationFormsTotalRow = async () => {
    const totalRows = await db
        .select({ count: count() })
        .from(applicationForms);
    return totalRows[0].count;
};

export const rejectApplicationFormById = async (
    applicationFormId: number,
    reviewer_id: string,
) => {
    return await db.transaction(async (tx) => {
        const updatedResult = await tx
            .update(applicationForms)
            .set({
                status: ApplicationFormStatus.REJECTED,
                reviewedByUserId: reviewer_id,
            })
            .where(
                and(
                    eq(applicationForms.id, applicationFormId),
                    // only allow reject pending application
                    eq(applicationForms.status, ApplicationFormStatus.PENDING),
                ),
            );

        return await tx.query.applicationForms.findFirst({
            where: (table, { eq }) => eq(table.id, applicationFormId),
        });
    });
};

export const approveApplicationFormById = async (
    applicationFormId: number,
    reviewer_id: string,
    generatedPassword: string,
) => {
    return await db.transaction(async (tx) => {
        const updatedResult = await tx
            .update(applicationForms)
            .set({
                status: ApplicationFormStatus.APPROVED,
                reviewedByUserId: reviewer_id,
            })
            .where(
                and(
                    eq(applicationForms.id, applicationFormId),
                    // only allow reject pending application
                    eq(applicationForms.status, ApplicationFormStatus.PENDING),
                ),
            );

        const af = await tx.query.applicationForms.findFirst({
            where: (table, { eq }) => eq(table.id, applicationFormId),
        });
        if (!af) {
            throw new Error("Application form not found");
        }

        const hashedPassword = await bcrypt.hash(
            generatedPassword,
            SALT_ROUNDS,
        );

        await tx.insert(users).values({
            firstName: af.firstName,
            lastName: af.lastName,
            email: af.email,
            password: hashedPassword,
            type: UserType.USER,
        });

        return af;
    });
};
