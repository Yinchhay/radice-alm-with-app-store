'use client'

import { assignRole } from "@/actions/super_admin";
import { Roles, Users } from "@prisma/client";
import { useEffect, useRef, useState } from "react";

export default function AssignRole() {
    const [users, setUsers] = useState<Users[]>([]);
    const [roles, setRoles] = useState<Roles[]>([]);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        async function getUserAndRole() {
            const resUsers = await fetch('/api/v1/auth/superadmin/user/all');
            const jsonUsers = await resUsers.json();
            if (jsonUsers.success) {
                setUsers([...jsonUsers.data.users]);
            }

            const resRoles = await fetch('/api/v1/auth/guest/role/all');
            const jsonRoles = await resRoles.json();
            if (jsonRoles.success) {
                setRoles([...jsonRoles.data.roles]);
            }
        }
        getUserAndRole();
    }, []);

    if (users.length === 0 || roles.length === 0) {
        return <span>Message from assign role component: Login to assign role</span>
    }

    return (
        <>
            <form ref={formRef} action={async (formData: FormData) => {
                const { success, message } = await assignRole(formData);

                alert(message);
                formRef.current?.reset()
            }}>
                <div>
                    <label htmlFor="userId">userId</label>
                    <select name="userId" id="userId" placeholder="userId">
                        {
                            users.map((user) => {
                                return (
                                    <option key={user.id} value={user.id}>{user.username}</option>
                                )
                            })
                        }
                    </select>
                </div>
                {
                    roles.map((role) => {
                        return (
                            <div key={role.id}>
                                <label htmlFor={role.id}>{role.name}</label>
                                <input type="checkbox" value={role.id} name="roleId" id={role.id} />
                            </div>
                        )
                    })
                }
                <button type="submit">Submit</button>
            </form>
        </>
    )
}