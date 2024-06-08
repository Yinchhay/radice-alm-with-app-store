import { applicationForms } from "@/drizzle/schema";
import { db } from "@/drizzle/db";

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
