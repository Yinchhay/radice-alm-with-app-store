"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import FormErrorMessages from "@/components/FormErrorMessages";
import Overlay from "@/components/Overlay";
import { users } from "@/drizzle/schema";
import { IconX } from "@tabler/icons-react";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { usePathname } from "next/navigation";

import { fetchDeleteUserById } from "./fetch";

export function DeleteUserOverlay({
    user,
}: {
    user: typeof users.$inferSelect;
}) {
    const pathname = usePathname();
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchDeleteUserById>>>();

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
                    data-test={`deleteUser-${user.id}`}
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
                                    You are about to delete user name{" "}
                                    <strong>
                                        {user.firstName} {user.lastName}
                                    </strong>
                                </p>
                            </div>
                        </div>
                        <form
                            action={async () => {
                                const result = await fetchDeleteUserById(
                                    user.id,
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
                                <DeleteUserBtn />
                            </div>
                        </form>
                    </Card>
                </Overlay>
            )}
        </>
    );
}

function DeleteUserBtn() {
    const formStatus = useFormStatus();
    return (
        <Button
            data-test="deleteUserBtn"
            disabled={formStatus.pending}
            variant="danger"
        >
            {formStatus.pending ? "Deleting" : "Delete"}
        </Button>
    );
}
