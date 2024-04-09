"use client";
import { useParams } from "next/navigation";

export default function ProjectsIDShower() {
    const params = useParams<{ project_id: string }>();
    return (
        <div>
            <h1>Project {params.project_id} Page</h1>
            <a href={`/dashboard/builder/${params.project_id}`}>Builder</a>
        </div>
    );
}
