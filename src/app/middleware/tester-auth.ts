import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getTesterById } from "@/repositories/tester";

// ============================================================================
// TYPES
// ============================================================================

export interface TesterTokenPayload {
    id: string;
    email: string;
    type: "tester";
    iat?: number;
    exp?: number;
}

export interface AuthenticatedTesterRequest extends NextRequest {
    tester?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string | null;
        profileUrl: string | null;
        description: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
    };
}

// ============================================================================
// MIDDLEWARE FUNCTIONS
// ============================================================================

/**
 * Verify tester JWT token from cookie
 */
export async function verifyTesterToken(request: NextRequest): Promise<TesterTokenPayload | null> {
    const token = request.cookies.get("tester-token")?.value;
    
    if (!token) {
        return null;
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TesterTokenPayload;
        
        // Ensure it's a tester token, not a regular user token
        if (decoded.type !== "tester") {
            return null;
        }
        
        return decoded;
    } catch (error) {
        console.error("JWT verification failed:", error);
        return null;
    }
}

/**
 * Get authenticated tester from token
 */
export async function getAuthenticatedTester(request: NextRequest) {
    const decoded = await verifyTesterToken(request);
    
    if (!decoded) {
        return null;
    }
    
    try {
        const tester = await getTesterById(decoded.id);
        return tester;
    } catch (error) {
        console.error("Failed to get tester by ID:", error);
        return null;
    }
}

/**
 * Middleware to require tester authentication
 */
export function requireTesterAuth(handler: (request: AuthenticatedTesterRequest) => Promise<NextResponse>) {
    return async (request: NextRequest) => {
        const tester = await getAuthenticatedTester(request);
        
        if (!tester) {
            return NextResponse.json(
                { error: "Authentication required. Please log in as a tester." },
                { status: 401 }
            );
        }
        
        // Add tester to request object
        (request as AuthenticatedTesterRequest).tester = tester;
        
        return handler(request as AuthenticatedTesterRequest);
    };
}

/**
 * Middleware to optionally get tester if authenticated
 */
export function optionalTesterAuth(handler: (request: AuthenticatedTesterRequest) => Promise<NextResponse>) {
    return async (request: NextRequest) => {
        const tester = await getAuthenticatedTester(request);
        
        // Add tester to request object (will be undefined if not authenticated)
        (request as AuthenticatedTesterRequest).tester = tester || undefined;
        
        return handler(request as AuthenticatedTesterRequest);
    };
}

/**
 * Create unauthorized response
 */
export function createUnauthorizedResponse(message: string = "Unauthorized") {
    return NextResponse.json(
        { error: message },
        { status: 401 }
    );
}

/**
 * Create forbidden response
 */
export function createForbiddenResponse(message: string = "Forbidden") {
    return NextResponse.json(
        { error: message },
        { status: 403 }
    );
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate tester JWT token
 */
export function generateTesterToken(tester: { id: string; email: string }): string {
    return jwt.sign(
        { 
            id: tester.id, 
            email: tester.email,
            type: "tester"
        },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
    );
}

/**
 * Set tester authentication cookie
 */
export function setTesterAuthCookie(response: NextResponse, token: string) {
    response.cookies.set("tester-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60, // 24 hours
        path: "/",
    });
}

/**
 * Clear tester authentication cookie
 */
export function clearTesterAuthCookie(response: NextResponse) {
    response.cookies.set("tester-token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        path: "/",
    });
}

/**
 * Check if request has valid tester session
 */
export async function hasTesterSession(request: NextRequest): Promise<boolean> {
    const decoded = await verifyTesterToken(request);
    return decoded !== null;
}

// ============================================================================
// ROUTE PROTECTION HELPERS
// ============================================================================

/**
 * Protect API route - require tester authentication
 */
export function protectTesterRoute(handler: Function) {
    return async (request: NextRequest, context?: any) => {
        const tester = await getAuthenticatedTester(request);
        
        if (!tester) {
            return createUnauthorizedResponse("Tester authentication required");
        }
        
        // Pass tester info to the handler
        return handler(request, { ...context, tester });
    };
}

/**
 * Protect page - redirect to login if not authenticated
 */
export async function protectTesterPage(request: NextRequest) {
    const tester = await getAuthenticatedTester(request);
    
    if (!tester) {
        return NextResponse.redirect(new URL("/testers/login", request.url));
    }
    
    return null; // Continue to page
}