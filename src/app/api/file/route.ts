import { NextRequest } from "next/server";
import path from "path";
import fs from "fs";
import { HttpStatusCode } from "@/types/http";

export async function GET(request: NextRequest) {
    try {
        const filename = request.nextUrl.searchParams.get("filename");
        const fileAbsPath = `${path.join(process.cwd(), `/src/file_storage/${filename}`)}`;

        if (!fs.existsSync(fileAbsPath)) {
            return new Response("File not found", {
                status: HttpStatusCode.NOT_FOUND_404,
            });
        }

        const file = await fs.promises.readFile(fileAbsPath);
        // const fileExtension = path.extname(fileAbsPath);

        // TODO: Add more file extensions (in case we restrict to allow user upload only image files)
        // const imageExtensions = [".png", ".jpg", ".jpeg", ".gif"];
        // if (imageExtensions.includes(fileExtension)) {
        //     return new Response(file, {
        //         headers: {
        //             "Content-Type": "image",
        //         },
        //     });
        // }

        return new Response(file, {
            status: HttpStatusCode.OK_200,
        });
    } catch (error) {
        return new Response("Failed to read file", {
            status: HttpStatusCode.INTERNAL_SERVER_ERROR_500,
        });
    }
}
