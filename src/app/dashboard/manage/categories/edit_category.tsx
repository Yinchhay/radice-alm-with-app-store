"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Overlay from "@/components/Overlay";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { editCategoryAction } from "./action";
import InputField from "@/components/InputField";
import FormErrorMessages from "@/components/FormErrorMessages";
import { IconEdit } from "@tabler/icons-react";
import { categories } from "@/drizzle/schema";

export function EditCategoryOverlay({
    category,
}: {
    category: typeof categories.$inferSelect;
}) {
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    // bind the category id to the editCategoryAction to prevent client side from changing the
    // category id via inspect element.
    const boundEditCategoryAction = editCategoryAction.bind(null, category.id);
    const [formState, formAction] = useFormState(boundEditCategoryAction, {
        errors: null,
    });

    useEffect(() => {
        // close the overlay after editing successfully
        if (showOverlay && formState.errors === null) {
            setShowOverlay(false);
        }
    }, [formState]);

    return (
        <>
            <Button
                dataTest={`editCategory-${category.name}`}
                onClick={() => setShowOverlay(true)}
                square={true}
            >
                <IconEdit></IconEdit>
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
                                Edit Category
                            </h1>
                        </div>
                        <form action={formAction}>
                            <div className="flex flex-col items-start my-1">
                                <label htmlFor="name" className="font-normal">
                                    Name
                                </label>
                                <InputField
                                    name="name"
                                    id="name"
                                    defaultValue={category.name}
                                />
                            </div>
                            <div className="flex flex-col items-start my-1">
                                <label
                                    htmlFor="description"
                                    className="font-normal"
                                >
                                    Description
                                </label>
                                <InputField
                                    name="description"
                                    id="description"
                                    defaultValue={category.description ?? ""}
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
                                <EditCategoryBtn />
                            </div>
                        </form>
                    </Card>
                </Overlay>
            )}
        </>
    );
}

function EditCategoryBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} styleType="primary">
            {formStatus.pending ? "Editing" : "Edit"}
        </Button>
    );
}
