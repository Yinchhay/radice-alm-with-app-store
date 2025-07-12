import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getTesterByEmail } from "@/repositories/tester";
import { sendPasswordResetEmail } from "@/lib/email";

// ============================================================================
// TYPES
// ============================================================================

export interface PasswordResetTokenPayload {
    id: string;
    email: string;
    type: "password-reset";
    iat?: number;
    exp?: number;
}

// ============================================================================
// API ROUTE HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        // Validate email
        if (!email || typeof email !== "string") {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Check if email format is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        try {
            // Check if tester exists
            const tester = await getTesterByEmail(email);
            
            if (!tester) {
                // For security, we don't reveal whether the email exists or not
                // Always return success to prevent email enumeration
                return NextResponse.json(
                    { 
                        success: true, 
                        message: "If a tester account with this email exists, a password reset link has been sent." 
                    },
                    { status: 200 }
                );
            }

            // Generate password reset token (expires in 1 hour)
            const resetToken = jwt.sign(
                { 
                    id: tester.id, 
                    email: tester.email,
                    type: "password-reset"
                },
                process.env.JWT_SECRET!,
                { expiresIn: "1h" }
            );

            // Create reset URL
            const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/testers/reset-password?token=${resetToken}`;

            // Send password reset email
            await sendPasswordResetEmail(tester.email, resetUrl, `${tester.firstName} ${tester.lastName}`);

            return NextResponse.json(
                { 
                    success: true, 
                    message: "If a tester account with this email exists, a password reset link has been sent.",
                    ...(process.env.NODE_ENV === "development" && { resetToken })
                },
                { status: 200 }
            );

        } catch (error) {
            console.error("Database error during password reset:", error);
            
            // Still return success to prevent information leakage
            return NextResponse.json(
                { 
                    success: true, 
                    message: "If a tester account with this email exists, a password reset link has been sent." 
                },
                { status: 200 }
            );
        }

    } catch (error) {
        console.error("Password reset request error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}