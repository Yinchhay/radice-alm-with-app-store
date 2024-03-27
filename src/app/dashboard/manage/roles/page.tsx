import { CreateRolesOverlay } from "./create_role";
import { getRoles_C } from "@/repositories/role";
import { Role } from "./role";
import { Suspense } from "react";

export default async function ManageRoles() {
    const roles = await getRoles_C();
    const roleList = roles.map((role) => {
        return <Role key={role.id} role={role} />;
    });

    // TODO: style here later
    return (
        <Suspense fallback={"loading..."}>
            <div>
                <h1>Manage Roles</h1>
                <div className="max-w-96">
                    <div className="flex justify-between">
                        <h2 className="text-2xl font-bold capitalize">Name</h2>
                        <CreateRolesOverlay />
                    </div>
                    <div className="">
                        {roles.length > 0
                            ? roleList
                            : "No role in the system"}
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
