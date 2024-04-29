import { NextRequest } from "next/server";
import fs from "fs";
import { HttpStatusCode } from "@/types/http";
import { getFileStoragePath } from "@/lib/file";

export async function GET(request: NextRequest) {
    try {
        const filename = request.nextUrl.searchParams.get("filename");
        const savePath = getFileStoragePath();
        const fileAbsPath = `${savePath}/${filename}`

        if (!fs.existsSync(fileAbsPath)) {
            return new Response("File not found", {
                status: HttpStatusCode.NOT_FOUND_404,
            });
        }

        const file = await fs.promises.readFile(fileAbsPath);
   
        return new Response(file, {
            status: HttpStatusCode.OK_200,
        });
    } catch (error) {
        return new Response("Failed to read file", {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR_500,
        });
    }
}
