"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Overlay from "@/components/Overlay";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createCategoryAction } from "./action";
import InputField from "@/components/InputField";
import FormErrorMessages from "@/components/FormErrorMessages";

export function CreateCategoriesOverlay() {
    // TODO: temporarily use button, can change later once we focus on ui
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [formState, formAction] = useFormState(createCategoryAction, {
        errors: null,
    });

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
                                Create Category
                            </h1>
                        </div>
                        <form action={formAction}>
                            <label htmlFor="name">Name</label>
                            <InputField name="name" id="name" />
                            <br />
                            <label htmlFor="description">Description</label>
                            <InputField
                                type="description"
                                name="description"
                                id="description"
                            />
                            <br />
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
                            <Btn />
                        </div>
                        </form>
                    </Card>
                </Overlay>
            )}
        </>
    );
}

function Btn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} styleType="primary">
            {formStatus.pending ? "Creating" : "Create"}
        </Button>
    );
}