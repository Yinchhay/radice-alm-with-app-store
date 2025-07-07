import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getTesterByEmail } from "@/repositories/tester";
import { testerLoginSchema } from "../../schema";
import { generateTesterToken, setTesterAuthCookie } from "@/app/middleware/tester-auth";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validatedData = testerLoginSchema.parse(body);
        
        const tester = await getTesterByEmail(validatedData.email);
        if (!tester) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }
        
        const isPasswordValid = await bcrypt.compare(validatedData.password, tester.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }
        
        const token = generateTesterToken(tester);
        const response = NextResponse.json({
            message: "Login successful",
            tester: {
                id: tester.id,
                firstName: tester.firstName,
                lastName: tester.lastName,
                email: tester.email,
                phoneNumber: tester.phoneNumber,
                profileUrl: tester.profileUrl,
                description: tester.description,
                token: token,
            }
        });
        
        setTesterAuthCookie(response, token);
        return response;
    } catch (error) {
        console.error("Tester login error:", error);
        return NextResponse.json(
            { error: "Login failed" },
            { status: 500 }
        );
    }
}