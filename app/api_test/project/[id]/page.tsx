"use client"

import { useEffect, useState } from "react";

export default function Page({ params }: { params: any }) {
    const [project, setProject] = useState<any>();

    const getProjectById = async () => {
        await fetch(`/api/v1/auth/project/${params.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async res => {
            if (!res.ok) return console.log(await res.json())

            const projectz = await res.json();
            setProject(projectz.project);
        });
    }

    useEffect(() => {
        getProjectById();
    });

    const updateProjectById = async () => {
        await fetch(`/api/v1/auth/project/${params.id}/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                is_public: !project.is_public
            })
        }).then(async res => {
            console.log(await res.json());
            if (res.ok) getProjectById();
        })
    }

    return (<>
        {
            project ?
                <div className="">
                    <button onClick={updateProjectById}>toggle public update</button>
                    <pre>{JSON.stringify(project, null, 2)}</pre>
                </div> :
                <div className="">
                    <h1>project does not exist</h1>
                </div>
        }
    </>)
}