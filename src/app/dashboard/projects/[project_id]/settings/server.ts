"use server"
import { revalidateTags } from "@/lib/server_utils";
import { GetProjects_C_Tag, OneAssociatedProject_C_Tag, updateProjectPublicStatus } from "@/repositories/project";

export const togglePublicStatus =async (projectId: number,state: boolean) => {
    await updateProjectPublicStatus(projectId, state);
    await revalidateTags<OneAssociatedProject_C_Tag | GetProjects_C_Tag>(
        "OneAssociatedProject_C_Tag",
        "getProjects_C_Tag",
    );
}