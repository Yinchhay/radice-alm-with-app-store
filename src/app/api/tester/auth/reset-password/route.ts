import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { hash } from "bcryptjs";
import { db } from "@/drizzle/db";
import { testers } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

interface PasswordResetTokenPayload {
    id: string;
    email: string;
    type: "password-reset";
    iat?: number;
    exp?: number;
}

export async function POST(request: NextRequest) {
    try {
        const { token, newPassword, confirmPassword } = await request.json();

        if (!token || !newPassword || !confirmPassword) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json(
                { error: "Passwords do not match" },
                { status: 400 }
            );
        }

        let payload: PasswordResetTokenPayload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET!) as PasswordResetTokenPayload;

            if (payload.type !== "password-reset") {
                throw new Error("Invalid token type");
            }
        } catch (err) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        const hashedPassword = await hash(newPassword, 10);

        await db.update(testers).set({ password: hashedPassword }).where(eq(testers.id, payload.id));

        return NextResponse.json({ success: true, message: "Password reset successfully" }, { status: 200 });

    } catch (error) {
        console.error("Password reset failed:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
