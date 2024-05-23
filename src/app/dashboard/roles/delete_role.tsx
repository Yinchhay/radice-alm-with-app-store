"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import FormErrorMessages from "@/components/FormErrorMessages";
import Overlay from "@/components/Overlay";
import { roles } from "@/drizzle/schema";
import { IconX } from "@tabler/icons-react";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { usePathname } from "next/navigation";

import { fetchDeleteRoleById } from "./fetch";

export function DeleteRoleOverlay({
    role,
}: {
    role: typeof roles.$inferSelect;
}) {
    const pathname = usePathname();
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchDeleteRoleById>>>();

    useEffect(() => {
        // close the overlay after deleting successfully
        if (showOverlay && result?.success) {
            setShowOverlay(false);
        }
    }, [result]);

    return (
        <>
            <div className="">
                <Button
                    data-test={`deleteRole-${role.name}`}
                    onClick={() => setShowOverlay(true)}
                    square={true}
                    variant="danger"
                >
                    <IconX></IconX>
                </Button>
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
                        <form
                            action={async (formData: FormData) => {
                                const result = await fetchDeleteRoleById(
                                    role.id,
                                    pathname
                                );
                                setResult(result);
                            }}
                        >
                            {!result?.success && result?.errors && (
                                <FormErrorMessages errors={result?.errors} />
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
        <Button
            data-test="deleteRoleBtn"
            disabled={formStatus.pending}
            variant="danger"
        >
            {formStatus.pending ? "Deleting" : "Delete"}
        </Button>
    );
}
