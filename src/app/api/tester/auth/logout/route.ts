import { NextRequest, NextResponse } from "next/server";
import { clearTesterAuthCookie } from "@/app/middleware/tester-auth";

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      message: "Logout successful"
    });

    clearTesterAuthCookie(response);

    return response;
  } catch (error) {
    console.error("Tester logout error:", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}

// Optional: Support GET method for logout links
export async function GET(request: NextRequest) {
  return POST(request);
}