"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Overlay from "@/components/Overlay";
import { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import FormErrorMessages from "@/components/FormErrorMessages";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import { fetchCreateProject } from "./fetch";
import { useFormStatus } from "react-dom";
import { usePathname } from "next/navigation";
import Tooltip from "@/components/Tooltip";
import { useToast } from "@/components/Toaster";

export function CreateProjectOverlay() {
    const pathname = usePathname();
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchCreateProject>>>();
    const { addToast } = useToast();

    function onCancel() {
        setResult(undefined);
        setShowOverlay(false);
    }

    useEffect(() => {
        // close the overlay after creating successfully
        if (showOverlay && result?.success) {

            addToast(
                <div className="flex gap-2">
                    <IconCheck className="text-white bg-green-500 p-1 text-sm rounded-full flex-shrink-0" />
                    <p>Successfully created project</p>
                </div>,
            );
            onCancel();
        }
    }, [result]);

    return (
        <>
            <Tooltip title="Create a project" zIndex={5000}>
                <Button
                    data-test="createProject"
                    onClick={() => setShowOverlay(true)}
                    square={true}
                    variant="primary"
                >
                    <IconPlus></IconPlus>
                </Button>
            </Tooltip>
            {showOverlay && (
                <Overlay
                    onClose={onCancel}
                >
                    <Card className="w-[480px] font-normal max-h-[800px] overflow-y-auto">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-2xl font-bold capitalize">
                                Create Project
                            </h1>
                        </div>
                        <form
                            action={async (formData: FormData) => {
                                const result = await fetchCreateProject(
                                    {
                                        name: formData.get("name") as string,
                                    },
                                    pathname,
                                );
                                setResult(result);
                            }}
                        >
                            <div className="flex flex-col items-start my-1">
                                <label htmlFor="name" className="font-normal">
                                    Name
                                </label>
                                <InputField name="name" id="name" />
                            </div>
                            {!result?.success && result?.errors && (
                                <FormErrorMessages errors={result?.errors} />
                            )}
                            <div className="flex justify-end gap-2 mt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                >
                                    Cancel
                                </Button>
                                <CreateProjectBtn />
                            </div>
                        </form>
                    </Card>
                </Overlay>
            )}
        </>
    );
}

function CreateProjectBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Creating" : "Create"}
        </Button>
    );
}
