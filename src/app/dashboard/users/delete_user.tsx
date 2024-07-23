"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import FormErrorMessages from "@/components/FormErrorMessages";
import Overlay from "@/components/Overlay";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { usePathname } from "next/navigation";
import { fetchDeleteUserById } from "./fetch";
import { UserWithoutPassword } from "../projects/[project_id]/settings/project_member";
import Tooltip from "@/components/Tooltip";
import { useToast } from "@/components/Toaster";

export function DeleteUserOverlay({ user }: { user: UserWithoutPassword }) {
    const pathname = usePathname();
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchDeleteUserById>>>();
    const { addToast } = useToast();

    function onCancel() {
        setResult(undefined);
        setShowOverlay(false);
    }

    useEffect(() => {
        // close the overlay after deleting successfully
        if (showOverlay && result?.success) {
            addToast(
                <div className="flex gap-2">
                    <IconCheck className="text-white bg-green-500 p-1 text-sm rounded-full flex-shrink-0" />
                    <p>Successfully deleted user</p>
                </div>,
            );

            onCancel();
        }
    }, [result]);

    return (
        <>
            <Tooltip title="Delete user">
                <Button
                    data-test={`deleteUser-${user.id}`}
                    onClick={() => setShowOverlay(true)}
                    square={true}
                    variant="danger"
                >
                    <IconX></IconX>
                </Button>
            </Tooltip>
            {showOverlay && (
                <Overlay onClose={onCancel}>
                    <Card className="w-[480px] font-normal flex flex-col gap-4 max-h-[800px] overflow-y-auto">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-2xl font-bold capitalize">
                                Delete
                            </h1>
                            <div className="">
                                <p>
                                    You are about to delete a user named{" "}
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
                                    pathname,
                                );
                                setResult(result);
                            }}
                        >
                            {!result?.success && result?.errors && (
                                <FormErrorMessages errors={result?.errors} />
                            )}
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
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
