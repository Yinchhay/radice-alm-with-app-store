"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Overlay from "@/components/Overlay";
import { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import FormErrorMessages from "@/components/FormErrorMessages";
import { IconPlus } from "@tabler/icons-react";
import { fetchCreateProject } from "./fetch";
import { useFormStatus } from "react-dom";

export function CreateProjectOverlay() {
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchCreateProject>>>();

    useEffect(() => {
        // close the overlay after creating successfully
        if (showOverlay && result?.success) {
            setShowOverlay(false);
        }
    }, [result]);

    return (
        <>
            <Button
                data-test="createProject"
                onClick={() => setShowOverlay(true)}
                square={true}
                variant="primary"
            >
                <IconPlus></IconPlus>
            </Button>
            {showOverlay && (
                <Overlay
                    onClose={() => {
                        setShowOverlay(false);
                    }}
                >
                    <Card className="w-[300px]">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-2xl font-bold capitalize">
                                Create Project
                            </h1>
                        </div>
                        <form
                            action={async (formData: FormData) => {
                                const result = await fetchCreateProject({
                                    name: formData.get("name") as string,
                                });
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
                                    onClick={() => {
                                        setShowOverlay(false);
                                    }}
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
