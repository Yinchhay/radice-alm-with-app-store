'use client'
import { Permissions } from "@prisma/client"
import { useEffect, useState } from "react"

export default function Permissions() {
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

    return (<>
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
    </>)
}