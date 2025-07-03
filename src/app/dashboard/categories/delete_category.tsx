"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import FormErrorMessages from "@/components/FormErrorMessages";
import Overlay from "@/components/Overlay";
import { categories } from "@/drizzle/schema";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { IconCheck } from "@tabler/icons-react";
import { fetchDeleteCategoryById } from "./fetch";
import { usePathname } from "next/navigation";
import { useToast } from "@/components/Toaster";

export function DeleteCategoryOverlay({
    category,
}: {
    category: typeof categories.$inferSelect;
}) {
    const pathname = usePathname();
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchDeleteCategoryById>>>();
    const { addToast } = useToast();

    function onCancel() {
        setResult(undefined);
        setShowOverlay(false);
    }

    useEffect(() => {
        if (showOverlay && result?.success) {
            addToast(
                <div className="flex gap-2">
                    <IconCheck className="text-white bg-green-500 p-1 text-sm rounded-full flex-shrink-0" />
                    <p>Successfully deleted category</p>
                </div>,
            );
            onCancel();
        }
    }, [result]);

    return (
        <>
            <Button
                data-test={`deleteCategory-${category.name}`}
                onClick={() => setShowOverlay(true)}
                className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white"
            >
                Delete
            </Button>
            {showOverlay && (
                <Overlay onClose={onCancel}>
                    <Card className="w-[480px] font-normal max-h-[800px] overflow-y-auto">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-2xl font-bold capitalize">
                                Delete
                            </h1>
                            <div className="">
                                <p>
                                    You are about to delete
                                    <strong> {category.name} </strong>
                                    category
                                </p>
                            </div>
                        </div>
                        <form
                            action={async (formData: FormData) => {
                                const result = await fetchDeleteCategoryById(
                                    category.id,
                                    pathname,
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
                                    onClick={onCancel}
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
        <Button
            data-test="deleteCategoryBtn"
            disabled={formStatus.pending}
            className="bg-red-600 hover:bg-red-700 text-white"
        >
            {formStatus.pending ? "Deleting" : "Delete"}
        </Button>
    );
}