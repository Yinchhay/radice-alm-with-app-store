"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import FormErrorMessages from "@/components/FormErrorMessages";
import InputField from "@/components/InputField";
import Overlay from "@/components/Overlay";
import { categories } from "@/drizzle/schema";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { deleteCategoryAction } from "./action";
import { IconX } from "@tabler/icons-react";

export function DeleteCategoryOverlay({
    category,
}: {
    category: typeof categories.$inferSelect;
}) {
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    /**
     * bind the category id to the deleteCategoryAction to prevent client side from changing the
     * category id via inspect element.
     * for the bind function, the first argument is the context, and the second argument is the
     * first arg of the function. if the function has more than one arg, the second arg will be the
     * second arg of the function, and so on.
     */
    const boundDeleteCategoryAction = deleteCategoryAction.bind(
        null,
        category.id,
    );
    const [formState, formAction] = useFormState(boundDeleteCategoryAction, {
        errors: null,
    });

    useEffect(() => {
        // close the overlay after deleting successfully
        if (showOverlay && formState.errors === null) {
            setShowOverlay(false);
        }
    }, [formState]);

    return (
        <>
            <div className="">
                <Button
                    dataTest={`deleteCategory-${category.name}`}
                    onClick={() => setShowOverlay(true)}
                    square={true}
                    styleType="danger"
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
                                    You are about to delete category name{" "}
                                    <strong>{category.name}</strong>
                                </p>
                            </div>
                        </div>
                        <form action={formAction}>
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
                                <DeleteCategoryBtn />
                            </div>
                        </form>
                    </Card>
                </Overlay>
            )}
        </>
    );
}

function DeleteCategoryBtn() {
    const formStatus = useFormStatus();
    return (
        <Button dataTest="deleteCategoryBtn" disabled={formStatus.pending} styleType="danger">
            {formStatus.pending ? "Deleting" : "Delete"}
        </Button>
    );
}
