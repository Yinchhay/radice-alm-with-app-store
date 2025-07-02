import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createTester, testerExistsByEmail } from "@/repositories/tester";
import { testerRegistrationSchema } from "../../schema";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Validate input
        const validatedData = testerRegistrationSchema.parse(body);
        
        // Check if tester already exists
        const existingTester = await testerExistsByEmail(validatedData.email);
        if (existingTester) {
            return NextResponse.json(
                { error: "A tester with this email already exists" },
                { status: 409 }
            );
        }
        
        // Create tester (password hashing is handled in the repository)
        await createTester({
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            email: validatedData.email,
            password: validatedData.password,
            phoneNumber: validatedData.phoneNumber || null,
        });
        
        return NextResponse.json(
            { message: "Tester account created successfully" },
            { status: 201 }
        );
        
    } catch (error) {
        console.error("Tester registration error:", error);
        
        if (error instanceof Error && error.name === "ZodError") {
            return NextResponse.json(
                { error: "Invalid input data", details: error.message },
                { status: 400 }
            );
        }
        
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}