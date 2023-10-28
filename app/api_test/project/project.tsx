"use client"

import { useState } from "react";

export default function Project() {
    const [projects, setProjects] = useState<any>();
    const [project, setProject] = useState<any>();

    const createOneProject = async () => {
        await fetch('/api/v1/auth/project/create', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: "test",
                description: "test",
                year: "2021",
                phase: "test",
                components: {
                    type: "test"
                },
                category_id: 1,
            })
        }).then(async res => {
            // if (!res.ok) return console.log(await res.json())
            console.log(await res.json());
        });
    }

    return (<>
        <h1>Project</h1>
        <button onClick={createOneProject}>Create One Project</button>
        {/* {
            project && <pre> project has been created {JSON.stringify(project, null, 2)}</pre>
        } */}
    </>);
}