import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createTester, testerExistsByEmail, getTesterByEmail } from "@/repositories/tester";
import { testerRegistrationSchema } from "../../schema";
import { generateTesterToken, setTesterAuthCookie } from "@/app/middleware/tester-auth";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const validatedData = testerRegistrationSchema.parse(body);

        const existingTester = await testerExistsByEmail(validatedData.email);
        if (existingTester) {
            return NextResponse.json(
                { error: "A tester with this email already exists" },
                { status: 409 }
            );
        }

        await createTester({
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            email: validatedData.email,
            password: validatedData.password,
            phoneNumber: validatedData.phoneNumber || null,
        });

        const tester = await getTesterByEmail(validatedData.email);
        if (!tester) {
            return NextResponse.json(
                { error: "Failed to retrieve newly created tester" },
                { status: 500 }
            );
        }

        const token = generateTesterToken({ id: tester.id, email: tester.email });

        const response = NextResponse.json({
            message: "Tester account created and logged in successfully",
            tester: {
                id: tester.id,
                firstName: tester.firstName,
                lastName: tester.lastName,
                email: tester.email,
                phoneNumber: tester.phoneNumber,
                profileUrl: tester.profileUrl,
                description: tester.description
            },
        });

        setTesterAuthCookie(response, token);
        return response;

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
