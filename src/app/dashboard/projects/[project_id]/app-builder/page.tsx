import { getAppsByProjectId } from "@/repositories/app/internal";
import { getOneAssociatedProject } from "@/repositories/project";

export default async function AppBuilderPage({ params }: { params: { project_id: string } }) {
    const apps = await getAppsByProjectId(Number(params.project_id));
    const app = apps.length > 0 ? apps[0] : null; // Show first app, or replace with sorting logic
    const project = await getOneAssociatedProject(Number(params.project_id));
    const projectName = project?.name;

    if (!app) {
        return (
            <div>
                <h1 className="text-5xl font-bold">App Builder</h1>
                <p>Builder for project ID: <span className="font-mono">{params.project_id}</span></p>
                <p>Project Name: <span className="font-mono">{projectName ?? "No project found"}</span></p>
                <p className="text-red-500 font-semibold">No app found for this project.</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-5xl font-bold mb-4">App Builder</h1>
            <p>Builder for project ID: <span className="font-mono">{params.project_id}</span></p>
            <p>Project Name: <span className="font-mono">{projectName ?? "No project found"}</span></p>
            <div className="mt-6 space-y-2">
                <div><b>App ID:</b> {app.id}</div>
                <div><b>Project ID:</b> {app.projectId}</div>
                <div><b>Subtitle:</b> {app.subtitle}</div>
                <div><b>Type:</b> {app.type}</div>
                <div><b>About Description:</b> {app.aboutDesc}</div>
                <div><b>Content:</b> {app.content}</div>
                <div><b>Web URL:</b> {app.webUrl}</div>
                <div><b>Card Image:</b> {app.cardImage}</div>
                <div><b>Banner Image:</b> {app.bannerImage}</div>
                <div><b>Featured Priority:</b> {app.featuredPriority}</div>
                <div><b>Created At:</b> {app.createdAt?.toString()}</div>
                <div><b>Updated At:</b> {app.updatedAt?.toString()}</div>
            </div>
        </div>
    );
}
