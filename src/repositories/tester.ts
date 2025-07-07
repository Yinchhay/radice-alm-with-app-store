import { db } from "@/drizzle/db";
import { testers } from "@/drizzle/schema"; // Make sure to export testers from your schema
import { unstable_cache as cache } from "next/cache";
import { eq, count, sql, and, like, or } from "drizzle-orm";
import bcrypt from "bcrypt";
import { ROWS_PER_PAGE } from "@/lib/pagination";
import { z } from "zod";
import { SALT_ROUNDS } from "@/lib/IAM";

// ============================================================================
// AUTHENTICATION FUNCTIONS
// ============================================================================

/**
 * Get tester by email for login - includes password for authentication
 */
export const getTesterByEmail = async (email: string) => {
    return await db.query.testers.findFirst({
        where: (tester, { eq }) => eq(tester.email, email),
    });
};

/**
 * Create a new tester account
 */
export const createTester = async (tester: typeof testers.$inferInsert) => {
    const hashedPassword = await bcrypt.hash(tester.password, SALT_ROUNDS);

    const testerWithHashedPassword = {
        ...tester,
        password: hashedPassword,
    };

    return await db.insert(testers).values(testerWithHashedPassword);
};

/**
 * Update tester password
 */
export const updateTesterPassword = async (
    testerId: string,
    newPassword: string,
) => {
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    return await db
        .update(testers)
        .set({
            password: hashedPassword,
        })
        .where(eq(testers.id, testerId));
};

/**
 * Update tester email
 */
export const updateTesterEmail = async (testerId: string, newEmail: string) => {
    return await db
        .update(testers)
        .set({
            email: newEmail,
        })
        .where(eq(testers.id, testerId));
};

// ============================================================================
// PROFILE MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Get tester by ID (safe for client - excludes password)
 */
export const getTesterById = async (testerId: string) => {
    return await db.query.testers.findFirst({
        columns: {
            password: false, // Exclude password for client safety
        },
        where: eq(testers.id, testerId),
    });
};

/**
 * Get tester by ID with cache (safe for client - excludes password)
 */
export type GetTesterById_C_Tag = `getTesterById_C:${string}` | `getTesterById_C`;

export const getTesterById_C = async (testerId: string) => {
    return await cache(
        async (testerId: string) => {
            return await db.query.testers.findFirst({
                columns: {
                    password: false, // Exclude password for client safety
                },
                where: eq(testers.id, testerId),
            });
        },
        [], // Dependencies for cache
        {
            tags: [
                `getTesterById_C:${testerId}`,
                `getTesterById_C`,
            ],
        },
    )(testerId);
};

/**
 * Update tester profile information
 */
export const updateTesterProfileInformation = async (
    testerId: string,
    profileData: {
        firstName?: string;
        lastName?: string;
        phoneNumber?: string | null;
        profileUrl?: string | null;
        description?: string | null;
    }
) => {
    return await db
        .update(testers)
        .set({
            ...profileData,
            updatedAt: sql`NOW()`, // Ensure updatedAt is refreshed
        })
        .where(eq(testers.id, testerId));
};

// ============================================================================
// ADMIN/MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Get all testers (admin function)
 */
export const getAllTesters = async () => {
    return await db.query.testers.findMany({
        columns: {
            password: false, // Exclude password for safety
        },
        orderBy: sql`created_at DESC`,
    });
};

/**
 * Get testers with pagination and search
 */
export const getTesters = async (
    page: number = 1,
    rowsPerPage: number = ROWS_PER_PAGE,
    search: string = "",
) => {
    return await db.query.testers.findMany({
        limit: rowsPerPage,
        offset: (page - 1) * rowsPerPage,
        orderBy: sql`created_at DESC`,
        columns: {
            password: false, // Exclude password for safety
        },
        where: search ? 
            or(
                like(testers.firstName, `%${search}%`),
                like(testers.lastName, `%${search}%`),
                like(testers.email, `%${search}%`),
            ) : undefined,
    });
};

/**
 * Get total count of testers for pagination
 */
export const getTestersTotalRow = async (search: string = "") => {
    const totalRows = await db
        .select({ count: count() })
        .from(testers)
        .where(
            search ? 
                or(
                    like(testers.firstName, `%${search}%`),
                    like(testers.lastName, `%${search}%`),
                    like(testers.email, `%${search}%`),
                ) : undefined
        );
    return totalRows[0].count;
};

/**
 * Search testers by name or email
 */
export const getTestersBySearch = async (
    search: string,
    rowsPerPage: number = ROWS_PER_PAGE,
) => {
    return await db.query.testers.findMany({
        columns: {
            password: false,
            createdAt: false,
            updatedAt: false,
        },
        where: or(
            like(testers.firstName, `%${search}%`),
            like(testers.lastName, `%${search}%`),
            like(testers.email, `%${search}%`),
        ),
        limit: rowsPerPage,
        orderBy: sql`created_at DESC`,
    });
};

/**
 * Delete tester by ID
 */
export const deleteTesterById = async (testerId: string) => {
    return await db
        .delete(testers)
        .where(eq(testers.id, testerId));
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if tester exists by email
 */
export const testerExistsByEmail = async (email: string): Promise<boolean> => {
    const tester = await db.query.testers.findFirst({
        columns: {
            id: true,
        },
        where: eq(testers.email, email),
    });
    return !!tester;
};

/**
 * Get tester count
 */
export const getTesterCount = async (): Promise<number> => {
    const result = await db
        .select({ count: count() })
        .from(testers);
    return result[0].count;
};

/**
 * Update tester profile
 * @param testerId 
 * @param data 
 */
export async function updateTester(
    testerId: string,
    data: Partial<{
        firstName: string;
        lastName: string;
        phoneNumber: string | null;
        profileUrl: string | null;
        description: string | null;
    }>
) {
    try {
        await db
            .update(testers)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(testers.id, testerId));
    } catch (error) {
        console.error("Error updating tester:", error);
        throw new Error("Failed to update tester profile");
    }
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type TesterSelect = typeof testers.$inferSelect;
export type TesterInsert = typeof testers.$inferInsert;
export type TesterSelectSafe = Omit<TesterSelect, 'password'>;

// Cache tag types
export type GetTesterById_C_ReturnType = Awaited<ReturnType<typeof getTesterById_C>>;