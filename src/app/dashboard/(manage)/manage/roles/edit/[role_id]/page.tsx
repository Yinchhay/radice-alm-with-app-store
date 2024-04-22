"use client";
import { Suspense } from "react";
import { useFormStatus } from "react-dom";

import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { CreateAddUserToRoleOverlay } from "./add_user";

import { fetchRoleById } from "../../fetch";

type Params = { params: { role_id: number } };

export default async function EditRole({ params }: Params) {
    // const result = await fetchRoleById(Number(params.role_id));
    // console.log(result);
    return (
        <Suspense fallback={"loading..."}>
            <div>
                <BackButton />
                <h1>Edit Role {params.role_id}</h1>

                <div className="w-1/2">
                    <h3>Name</h3>
                    <InputField
                        name="name"
                        id="name"
                        // defaultValue={result.success}
                    />
                </div>
                <div>
                    <h3>Permission</h3>
                    {/* {result.data.length > 0 ? (
                        RoleList
                    ) : (
                        // TODO: style here
                        <NoRole />
                    )} */}
                </div>
                <div>
                    <CreateAddUserToRoleOverlay role={params.role_id} />
                </div>
            </div>
        </Suspense>
    );
}

function NoData(data: string) {
    return (
        <>
            <p>No permissions available!</p>
        </>
    );
}

function EditRoleBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Saving" : "Save Changes"}
        </Button>
    );
}

const BackButton = () => {
    const goBack = () => {
        window.history.back();
    };
    return <button onClick={goBack}>Back</button>;
};
