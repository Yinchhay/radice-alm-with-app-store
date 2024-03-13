"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Overlay from "@/components/Overlay";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createCategoryAction } from "./action";
import InputField from "@/components/InputField";
import FormErrorMessages from "@/components/FormErrorMessages";
import { IconPlus } from "@tabler/icons-react";

export function CreateCategoriesOverlay() {
    // TODO: temporarily use button, can change later once we focus on ui
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [formState, formAction] = useFormState(createCategoryAction, {
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
            <Button
                onClick={() => setShowOverlay(true)}
                square={true}
                styleType="primary"
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
                                Create Category
                            </h1>
                        </div>
                        <form action={formAction}>
                            <div className="flex flex-col items-start my-1">
                                <label htmlFor="name" className="font-normal">
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
                                <CreateCategoryBtn />
                            </div>
                        </form>
                    </Card>
                </Overlay>
            )}
        </>
    );
}

function CreateCategoryBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} styleType="primary">
            {formStatus.pending ? "Creating" : "Create"}
        </Button>
    );
}
