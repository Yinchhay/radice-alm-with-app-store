import { NextResponse } from "next/server";
import { hash, compare } from "bcryptjs";
import { db } from "@/drizzle/db";
import { testers } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import {
    requireTesterAuth,
    AuthenticatedTesterRequest,
} from "@/app/middleware/tester-auth";

export const POST = requireTesterAuth(
    async (request: AuthenticatedTesterRequest) => {
        try {
            const { currentPassword, newPassword, confirmNewPassword } =
                await request.json();

            if (!currentPassword || !newPassword || !confirmNewPassword) {
                return NextResponse.json(
                    { error: "All fields are required" },
                    { status: 400 },
                );
            }

            if (newPassword !== confirmNewPassword) {
                return NextResponse.json(
                    { error: "New passwords do not match" },
                    { status: 400 },
                );
            }

            const tester = request.tester;

            if (!tester || !tester.id) {
                return NextResponse.json(
                    { error: "Tester ID is missing or invalid" },
                    { status: 400 },
                );
            }

            const [dbTester] = await db
                .select()
                .from(testers)
                .where(eq(testers.id, tester.id))
                .limit(1);

            if (!dbTester) {
                return NextResponse.json(
                    { error: "Tester not found" },
                    { status: 404 },
                );
            }

            const isCorrect = await compare(currentPassword, dbTester.password);

            if (!isCorrect) {
                return NextResponse.json(
                    { error: "Current password is incorrect" },
                    { status: 403 },
                );
            }

            const hashed = await hash(newPassword, 10);

            await db
                .update(testers)
                .set({ password: hashed })
                .where(eq(testers.id, tester.id));

            return NextResponse.json({ success: true }, { status: 200 });
        } catch (err) {
            console.error("Change password error:", err);
            return NextResponse.json(
                { error: "Internal server error" },
                { status: 500 },
            );
        }
    },
);
