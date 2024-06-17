"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Overlay from "@/components/Overlay";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import InputField from "@/components/InputField";
import FormErrorMessages from "@/components/FormErrorMessages";
import { IconCheck, IconEdit } from "@tabler/icons-react";
import { categories } from "@/drizzle/schema";
import { fetchEditCategoryById } from "./fetch";
import { usePathname } from "next/navigation";
import ImageWithFallback from "@/components/ImageWithFallback";
import { ACCEPTED_IMAGE_TYPES, fileToUrl } from "@/lib/file";
import TextareaField from "@/components/TextareaField";
import Tooltip from "@/components/Tooltip";
import { useToast } from "@/components/Toaster";

export function EditCategoryOverlay({
    category,
}: {
    category: typeof categories.$inferSelect;
}) {
    const pathname = usePathname();
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchEditCategoryById>>>();
    const [logoSrc, setLogoSrc] = useState<string>(fileToUrl(category.logo));
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addToast } = useToast();

    function onCancel() {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setLogoSrc(fileToUrl(category.logo));
        setResult(undefined);
        setShowOverlay(false);
    }

    useEffect(() => {
        // close the overlay after editing successfully
        if (showOverlay && result?.success) {
            addToast(
                <div className="flex gap-2">
                    <IconCheck className="text-white bg-green-500 p-1 text-sm rounded-full flex-shrink-0" />
                    <p>Successfully edited category</p>
                </div>,
            );

            onCancel();
        }
    }, [result]);

    return (
        <>
            <Tooltip title="Edit category">
                <Button
                    data-test={`editCategory-${category.name}`}
                    onClick={() => setShowOverlay(true)}
                    square={true}
                >
                    <IconEdit></IconEdit>
                </Button>
            </Tooltip>
            {showOverlay && (
                <Overlay onClose={onCancel}>
                    <Card className="w-[480px] font-normal max-h-[800px] overflow-y-auto">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-2xl font-bold capitalize">
                                Edit Category
                            </h1>
                        </div>
                        <form
                            className="flex flex-col gap-2"
                            action={async (formData: FormData) => {
                                const result = await fetchEditCategoryById(
                                    {
                                        categoryId: category.id,
                                        name: formData.get("name") as string,
                                        description: formData.get(
                                            "description",
                                        ) as string,
                                        currentCategoryLogo:
                                            category.logo as string,
                                    },
                                    formData,
                                    pathname,
                                );
                                setResult(result);
                            }}
                        >
                            <div className="flex flex-col items-start">
                                <label
                                    htmlFor="categoryLogo"
                                    className="font-normal"
                                >
                                    Logo
                                </label>
                                <ImageWithFallback
                                    className="aspect-square object-cover rounded-sm hover:cursor-pointer"
                                    onClick={() => {
                                        if (fileInputRef.current) {
                                            fileInputRef.current.click();
                                        }
                                    }}
                                    src={logoSrc}
                                    alt={"category logo"}
                                    width={128}
                                    height={128}
                                />
                                <InputField
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setLogoSrc(
                                                URL.createObjectURL(file),
                                            );
                                        }
                                    }}
                                    hidden
                                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                    type="file"
                                    name="categoryLogo"
                                    id="categoryLogo"
                                />
                            </div>
                            <div className="flex flex-col items-start">
                                <label htmlFor="name" className="font-normal">
                                    Name
                                </label>
                                <InputField
                                    name="name"
                                    id="name"
                                    defaultValue={category.name}
                                />
                            </div>
                            <div className="flex flex-col items-start">
                                <label
                                    htmlFor="description"
                                    className="font-normal"
                                >
                                    Description
                                </label>
                                <TextareaField
                                    className="h-36"
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
                                    onClick={onCancel}
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
