"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Overlay from "@/components/Overlay";
import { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import FormErrorMessages from "@/components/FormErrorMessages";
import { IconPlus } from "@tabler/icons-react";
import { fetchCreateCategory } from "./fetch";
import { useFormStatus } from "react-dom";

export function CreateCategoryOverlay() {
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchCreateCategory>>>();
        
    useEffect(() => {
        // close the overlay after creating successfully
        if (showOverlay && result?.success) {
            setShowOverlay(false);
        }
    }, [result]);

    return (
        <>
            <Button
                data-test="createCategory"
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
                                    Create Category
                                </h1>
                            </div>
                            <form
                                action={async (formData: FormData) => {
                                    const result = await fetchCreateCategory({
                                        name: formData.get("name") as string,
                                        description: formData.get(
                                            "description",
                                        ) as string,
                                    });
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
                                <div className="flex flex-col items-start my-1">
                                    <label
                                        htmlFor="description"
                                        className="font-normal"
                                    >
                                        Description
                                    </label>
                                    <InputField
                                        type="description"
                                        name="description"
                                        id="description"
                                    />
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
                                    <CreateCategoryBtn />
                                </div>
                            </form>
                        </Card>
                    </Overlay>
                </div>
            )}
        </>
    );
}

function CreateCategoryBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Creating" : "Create"}
        </Button>
    );
}
