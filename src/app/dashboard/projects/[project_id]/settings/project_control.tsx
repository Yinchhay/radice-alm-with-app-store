"use client";
import { FetchOneAssociatedProjectData } from "@/app/api/internal/project/[project_id]/route";
import Button from "@/components/Button";
import Card from "@/components/Card";
import ToggleSwitch from "@/components/ToggleSwitch";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Overlay from "@/components/Overlay";
import { useFormStatus } from "react-dom";
import FormErrorMessages from "@/components/FormErrorMessages";
import InputField from "@/components/InputField";
import {
    fetchTransferProjectOwnerShip,
    fetchUpdateProjectPublicStatus,
} from "./fetch";

export function ProjectControl({
    project,
}: {
    project: FetchOneAssociatedProjectData["project"];
}) {
    if (!project) {
        throw new Error("Project does not exist");
    }

    const pathname = usePathname();

    return (
        <Card>
            <h1 className="text-2xl">Project control</h1>
            <div className="my-4 flex flex-col gap-4">
                <div className="flex flex-row justify-between items-center">
                    <p className="text-lg">Make project public</p>
                    <ToggleSwitch
                        defaultState={Boolean(project.isPublic)}
                        onChange={async (state: boolean) => {
                            await fetchUpdateProjectPublicStatus(
                                project.id,
                                {
                                    status: state,
                                },
                                pathname,
                            );
                        }}
                    />
                </div>
                <div className="flex flex-row justify-between items-center">
                    <p className="text-lg">Transfer project</p>
                    <TransferProject project={project} />
                </div>
            </div>
        </Card>
    );
}

function TransferProject({
    project,
}: {
    project: FetchOneAssociatedProjectData["project"];
}) {
    const pathname = usePathname();
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] = useState<Awaited<ReturnType<any>>>();

    async function onSubmit(formData: FormData) {
        if (!project) {
            return;
        }

        const res = await fetchTransferProjectOwnerShip(
            project.id,
            {
                email: formData.get("email") as string,
            },
            pathname,
        );
        setResult(res);
    }

    useEffect(() => {
        // close the overlay after transferring successfully
        if (showOverlay && result?.success) {
            setShowOverlay(false);
            window.location.reload();
        }
    }, [result]);

    return (
        <>
            <Button
                onClick={() => {
                    setShowOverlay(true);
                }}
                variant="secondary"
                type="button"
            >
                Transfer
            </Button>
            {showOverlay && (
                <Overlay
                    onClose={() => {
                        setShowOverlay(false);
                    }}
                >
                    <Card className="w-[300px] font-normal">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-2xl font-bold capitalize">
                                Transfer Project
                            </h1>
                        </div>
                        <form
                            className="flex flex-col gap-2 my-4"
                            action={onSubmit}
                        >
                            <div className="flex flex-col items-start">
                                <label htmlFor="email" className="font-normal">
                                    Transfer to email
                                </label>
                                <InputField
                                    type="email"
                                    name="email"
                                    id="email"
                                />
                            </div>
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
                                <TransferButton />
                            </div>
                        </form>
                    </Card>
                </Overlay>
            )}
        </>
    );
}

function TransferButton() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Transferring" : "Transfer"}
        </Button>
    );
}
