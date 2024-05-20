import { FetchOneAssociatedProjectData } from "@/app/api/internal/project/[project_id]/route";
import Card from "@/components/Card";

export function ProjectPipeline({
    project,
}: {
    project: FetchOneAssociatedProjectData["project"];
}) {
    return (
        <Card>
            <h1 className="text-2xl">Project pipeline</h1>
        </Card>
    );
}
