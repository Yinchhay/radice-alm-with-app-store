'use client'
import { createRole } from "@/actions/super_admin";
import { useEffect, useRef, useState } from "react";
import { Permissions } from "@prisma/client";

export default function CreateRole() {
    const formRef = useRef<HTMLFormElement>(null);
    const [permissions, setPermissions] = useState<Permissions[]>([]);

    useEffect(() => {
        async function getPermissions() {
            const res = await fetch('/api/v1/auth/guest/permission/all');
            const json = await res.json();
            if (json.success) {
                setPermissions([...json.data.permissions]);
            }
        }
        getPermissions();
    }, []);

    return (
        <>
            <form ref={formRef} action={async (formData: FormData) => {
                const { success, message } = await createRole(formData);

                alert(message);
                formRef.current?.reset();
            }}>
                <div>
                    <label htmlFor="name">name</label>
                    <input type="text" name="name" id="name" placeholder="name" />
                </div>
                <div>
                    <label htmlFor="description">description</label>
                    <input type="text" name="description" id="description" placeholder="description" />
                </div>
                {
                    permissions.map((permission) => {
                        return (
                            <div key={permission.id}>
                                <label htmlFor={permission.id}>{permission.name}</label>
                                <input type="checkbox" value={permission.identifier} name="permission" id={permission.id} />
                            </div>
                        )
                    })
                }
                <button type="submit">Submit</button>
            </form>
        </>
    )
}