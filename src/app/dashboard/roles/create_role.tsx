"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Overlay from "@/components/Overlay";
import InputField from "@/components/InputField";
import FormErrorMessages from "@/components/FormErrorMessages";
import { IconPlus } from "@tabler/icons-react";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useFormStatus } from "react-dom";

import { fetchCreateRole } from "./fetch";

export function CreateRoleOverlay() {
    const pathname = usePathname();
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchCreateRole>>>();

    useEffect(() => {
        // close the overlay after creating successfully
        if (showOverlay && result?.success) {
            setShowOverlay(false);
        }
    }, [result]);

    return (
        <>
            <Button
                data-test="createRole"
                onClick={() => setShowOverlay(true)}
                square={true}
                variant="primary"
            >
                <IconPlus></IconPlus>
            </Button>
            {showOverlay && (
                <div className="font-normal">
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
                            <form
                                action={async (formData: FormData) => {
                                    const result = await fetchCreateRole({
                                        name: formData.get("name") as string,
                                    }, pathname);
                                    setResult(result);
                                }}
                            >
                                <div className="flex flex-col items-start my-1">
                                    <label
                                        htmlFor="name"
                                        className="font-normal"
                                    >
                                        Name
                                    </label>
                                    <InputField name="name" id="name" />
                                </div>

                                {!result?.success && result?.errors && (
                                    <FormErrorMessages
                                        errors={result?.errors}
                                    />
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
                </div>
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
