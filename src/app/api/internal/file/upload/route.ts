import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import { getOneAssociatedProject } from "@/repositories/project";
import { checkProjectRole, ProjectRole } from "@/lib/project";
import { lucia } from "@/auth/lucia";
import { getUserById } from "@/repositories/users";
import { UserType } from "@/types/user";

const UPLOAD_DIR = path.join(
    process.cwd(),
    process.env.FILE_STORAGE_PATH || "/mnt/RadiceStorageFolder",
);

export async function POST(req: NextRequest) {
    if (!existsSync(UPLOAD_DIR)) {
        mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // --- Minimal auth: check Authorization header, then fallback to auth_session cookie ---
    let sessionId: string | undefined = undefined;
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        sessionId = authHeader.split(" ")[1];
    }
    if (!sessionId) {
        // Try cookie
        sessionId = req.cookies.get("auth_session")?.value;
    }
    console.log("[UPLOAD DEBUG] sessionId:", sessionId);
    if (!sessionId) {
        console.log("[UPLOAD DEBUG] No sessionId found");
        return NextResponse.json(
            { success: false, message: "Unauthorized (no session)" },
            { status: 401 },
        );
    }

    // Validate session
    const { session, user } = await lucia.validateSession(sessionId);
    console.log("[UPLOAD DEBUG] session:", session);
    console.log("[UPLOAD DEBUG] user:", user);
    if (!session || !user) {
        console.log("[UPLOAD DEBUG] Invalid session or user");
        return NextResponse.json(
            { success: false, message: "Unauthorized (invalid session)" },
            { status: 401 },
        );
    }

    const formData = await req.formData();
    const projectId = formData.get("projectId");
    if (!projectId) {
        return NextResponse.json(
            { success: false, message: "Missing projectId" },
            { status: 400 },
        );
    }

    // Fetch project and check role
    const project = await getOneAssociatedProject(Number(projectId));
    if (!project) {
        return NextResponse.json(
            { success: false, message: "Project not found" },
            { status: 404 },
        );
    }
    const { projectRole } = checkProjectRole(user.id, project, user.type);
    console.log("[UPLOAD DEBUG] user.type:", user.type);
    console.log("[UPLOAD DEBUG] projectRole:", projectRole);
    if (
        !(
            user.type === UserType.SUPER_ADMIN ||
            projectRole !== ProjectRole.NONE
        )
    ) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 },
        );
    }

    const files = [];
    for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
            files.push(value);
        }
    }

    if (files.length === 0) {
        return NextResponse.json(
            { success: false, message: "No files uploaded." },
            { status: 400 },
        );
    }

    const uploadedPaths = [];
    for (const file of files) {
        const ext = path.extname(file.name) || "";
        const baseName = path.basename(file.name, ext);
        const timestamp = Date.now();
        const safeName = `${baseName}_${timestamp}${ext}`;
        const filePath = path.join(UPLOAD_DIR, safeName);
        const fileId = `apps/${safeName}`;

        // Write file to disk
        const arrayBuffer = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(arrayBuffer));
        uploadedPaths.push(fileId);
    }

    return NextResponse.json({ success: true, paths: uploadedPaths });
}

export async function GET() {
    return NextResponse.json(
        { success: false, message: "Method Not Allowed" },
        { status: 405 },
    );
}

export async function PUT() {
    return NextResponse.json(
        { success: false, message: "Method Not Allowed" },
        { status: 405 },
    );
}

export async function DELETE() {
    return NextResponse.json(
        { success: false, message: "Method Not Allowed" },
        { status: 405 },
    );
}
