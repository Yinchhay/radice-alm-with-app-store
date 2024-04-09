import { FetchCreateProject } from "@/app/api/internal/project/create/route";
import { createProjectFormSchema } from "@/app/api/internal/project/schema";
import { fetchErrorSomethingWentWrong, ResponseJson } from "@/lib/response";
import {
    getBaseUrl,
    getSessionCookie,
    revalidateTags,
} from "@/lib/server_utils";
import { GetProjects_C_Tag } from "@/repositories/project";
import { z } from "zod";

export async function fetchCreateProject(
    body: z.infer<typeof createProjectFormSchema>,
): ResponseJson<FetchCreateProject> {
    try {
        const sessionId = await getSessionCookie();
        const response = await fetch(
            `${await getBaseUrl()}/api/internal/project/create`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${sessionId}`,
                },
                body: JSON.stringify(body),
            },
        );
        await revalidateTags<GetProjects_C_Tag>("getProjects_C_Tag");
        return await response.json();
    } catch (error: any) {
        return fetchErrorSomethingWentWrong;
    }
}
