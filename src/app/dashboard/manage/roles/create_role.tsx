"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Overlay from "@/components/Overlay";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createRoleAction } from "./action";
import InputField from "@/components/InputField";
import FormErrorMessages from "@/components/FormErrorMessages";

export function CreateRolesOverlay() {
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [formState, formAction] = useFormState(createRoleAction, {
        errors: null,
    });

    useEffect(() => {
        // close the overlay after creating successfully
        if (showOverlay && formState.errors === null) {
            setShowOverlay(false);
        }
    }, [formState]);

    return (
        <>
            <Button onClick={() => setShowOverlay(true)}>+</Button>
            {showOverlay && (
                <Overlay
                    onClose={() => {
                        setShowOverlay(false);
                    }}
                >
                    <Card className="w-[300px]">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-2xl font-bold capitalize">
                                Create Role
                            </h1>
                        </div>
                        <form action={formAction}>
                            <label htmlFor="name">Name</label>
                            <InputField name="name" id="name" />
                            <br />

                            {formState.errors && (
                                <FormErrorMessages errors={formState.errors} />
                            )}
                            <div className="flex justify-end gap-2 my-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowOverlay(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <CreateRoleBtn />
                            </div>
                        </form>
                    </Card>
                </Overlay>
            )}
        </>
    );
}

function CreateRoleBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Creating" : "Create"}
        </Button>
    );
}
