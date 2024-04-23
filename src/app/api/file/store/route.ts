import {
    buildSomethingWentWrongErrorResponse,
    buildSuccessResponse,
} from "@/lib/response";
import { HttpStatusCode } from "@/types/http";
import fs from "fs";
import path from "path";

const successMessage = "File uploaded successfully";
const unsuccessMessage = "Failed to upload file";

export type FetchFileStore = {
    imageSrc: string;
};

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new Response("No file found", {
                status: HttpStatusCode.BAD_REQUEST_400,
            });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // get current working directory and create a path to save the file
        const savePath = `${path.join(process.cwd(), `/src/file_storage`)}`;

        // create the directory if it doesn't exist
        if (!fs.existsSync(savePath)) {
            fs.mkdirSync(savePath, { recursive: true });
        }

        const savePathAndFileName = `${savePath}/${file.name}`;

        await fs.promises.writeFile(savePathAndFileName, buffer);

        return buildSuccessResponse<FetchFileStore>(successMessage, {
            imageSrc: savePath,
        });
    } catch (error) {
        return buildSomethingWentWrongErrorResponse(unsuccessMessage);
    }
}
