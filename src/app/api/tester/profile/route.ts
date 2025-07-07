// /api/tester/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
    requireTesterAuth,
    AuthenticatedTesterRequest,
} from "@/app/middleware/tester-auth";
import { getTesterById, updateTester } from "@/repositories/tester";
import { testerProfileUpdateSchema } from "../schema";

// GET /api/tester/profile - Get current tester profile
export const GET = requireTesterAuth(
    async (request: AuthenticatedTesterRequest) => {
        try {
            const tester = request.tester!;

            // Return tester profile (excluding password)
            return NextResponse.json({
                tester: {
                    id: tester.id,
                    firstName: tester.firstName,
                    lastName: tester.lastName,
                    email: tester.email,
                    phoneNumber: tester.phoneNumber,
                    profileUrl: tester.profileUrl,
                    description: tester.description,
                    createdAt: tester.createdAt,
                    updatedAt: tester.updatedAt,
                },
            });
        } catch (error) {
            console.error("Get tester profile error:", error);
            return NextResponse.json(
                { error: "Failed to get profile" },
                { status: 500 },
            );
        }
    },
);

// PATCH /api/tester/profile - Partially update current tester profile
export const PATCH = requireTesterAuth(
    async (request: AuthenticatedTesterRequest) => {
        try {
            const body = await request.json();
            const tester = request.tester!;

            // Make all fields optional for partial updates
            const partialUpdateSchema = testerProfileUpdateSchema.partial();
            const validatedData = partialUpdateSchema.parse(body);

            // Prepare update data (only include fields that were provided)
            const updateData: any = {};

            if (validatedData.firstName !== undefined)
                updateData.firstName = validatedData.firstName;
            if (validatedData.lastName !== undefined)
                updateData.lastName = validatedData.lastName;
            if (validatedData.phoneNumber !== undefined)
                updateData.phoneNumber = validatedData.phoneNumber;
            if (validatedData.profileUrl !== undefined)
                updateData.profileUrl = validatedData.profileUrl;
            if (validatedData.description !== undefined)
                updateData.description = validatedData.description;

            // Only update if there's actually data to update
            if (Object.keys(updateData).length === 0) {
                return NextResponse.json(
                    { error: "No fields to update" },
                    { status: 400 },
                );
            }

            // Update tester
            await updateTester(tester.id, updateData);

            // Get updated tester data
            const updatedTester = await getTesterById(tester.id);

            if (!updatedTester) {
                return NextResponse.json(
                    { error: "Failed to retrieve updated profile" },
                    { status: 500 },
                );
            }

            return NextResponse.json({
                message: "Profile updated successfully",
                tester: {
                    id: updatedTester.id,
                    firstName: updatedTester.firstName,
                    lastName: updatedTester.lastName,
                    email: updatedTester.email,
                    phoneNumber: updatedTester.phoneNumber,
                    profileUrl: updatedTester.profileUrl,
                    description: updatedTester.description,
                    createdAt: updatedTester.createdAt,
                    updatedAt: updatedTester.updatedAt,
                },
            });
        } catch (error) {
            console.error("Partial update tester profile error:", error);

            if (error instanceof z.ZodError) {
                return NextResponse.json(
                    {
                        error: "Invalid input data",
                        details: error.errors.map((err) => ({
                            field: err.path.join("."),
                            message: err.message,
                        })),
                    },
                    { status: 400 },
                );
            }

            return NextResponse.json(
                { error: "Failed to update profile" },
                { status: 500 },
            );
        }
    },
);
