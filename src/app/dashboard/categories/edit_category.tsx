"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Overlay from "@/components/Overlay";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import InputField from "@/components/InputField";
import FormErrorMessages from "@/components/FormErrorMessages";
import { IconEdit } from "@tabler/icons-react";
import { categories } from "@/drizzle/schema";
import { fetchEditCategoryById } from "./fetch";
import { usePathname } from "next/navigation";

export function EditCategoryOverlay({
    category,
}: {
    category: typeof categories.$inferSelect;
}) {
    const pathname = usePathname();
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchEditCategoryById>>>();

    useEffect(() => {
        // close the overlay after editing successfully
        if (showOverlay && result?.success) {
            setShowOverlay(false);
        }
    }, [result]);

    return (
        <>
            <Button
                data-test={`editCategory-${category.name}`}
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
                    <Card className="w-[300px] font-normal">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-2xl font-bold capitalize">
                                Edit Category
                            </h1>
                        </div>
                        <form
                            action={async (formData: FormData) => {
                                const result = await fetchEditCategoryById(
                                    {
                                        categoryId: category.id,
                                        name: formData.get("name") as string,
                                        description: formData.get(
                                            "description",
                                        ) as string,
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
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Editing" : "Edit"}
        </Button>
    );
}
