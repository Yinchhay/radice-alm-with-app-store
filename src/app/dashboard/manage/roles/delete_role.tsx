import Button from "@/components/Button";
import Card from "@/components/Card";
import FormErrorMessages from "@/components/FormErrorMessages";
import InputField from "@/components/InputField";
import Overlay from "@/components/Overlay";
import { roles } from "@/drizzle/schema";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { deleteRoleAction } from "./action";

export function DeleteRole({
    role,
}: {
    role: typeof roles.$inferSelect;
}) {
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [formState, formAction] = useFormState(deleteRoleAction, {
        errors: null,
    });

    useEffect(() => {
        // close the overlay after deleting successfully
        if (showOverlay && formState.errors === null) {
            setShowOverlay(false);
        }
    }, [formState]);

    return (
        <>
            <div className="">
                <Button onClick={() => setShowOverlay(true)}>Delete</Button>
            </div>
            {showOverlay && (
                <Overlay
                    onClose={() => {
                        setShowOverlay(false);
                    }}
                >
                    <Card className="w-[300px]">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-2xl font-bold capitalize">
                                Delete
                            </h1>
                            <div className="">
                                <p>
                                    You are about to delete role name{" "}
                                    <strong>{role.name}</strong>
                                </p>
                            </div>
                        </div>
                        <form action={formAction}>
                            <InputField
                                hidden
                                name="roleId"
                                id="roleId"
                                value={role.id.toString()}
                                type="hidden"
                            />
                            <br />
                            {formState.errors && (
                                <FormErrorMessages errors={formState.errors} />
                            )}
                            <div className="flex justify-end gap-2 my-3">
                                <Button
                                    type="button"
                                    styleType="outline"
                                    onClick={() => {
                                        setShowOverlay(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <DeleteRoleBtn />
                            </div>
                        </form>
                    </Card>
                </Overlay>
            )}
        </>
    );
}

function DeleteRoleBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} styleType="danger">
            {formStatus.pending ? "Deleting" : "Delete"}
        </Button>
    );
}
