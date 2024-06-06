"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Overlay from "@/components/Overlay";
import { useEffect, useRef, useState } from "react";
import InputField from "@/components/InputField";
import FormErrorMessages from "@/components/FormErrorMessages";
import { IconPlus } from "@tabler/icons-react";
import { fetchCreateCategory } from "./fetch";
import { useFormStatus } from "react-dom";
import { usePathname } from "next/navigation";
import ImageWithFallback from "@/components/ImageWithFallback";
import { ACCEPTED_IMAGE_TYPES } from "@/lib/file";
import TextareaField from "@/components/TextareaField";
import Tooltip from "@/components/Tooltip";

export function CreateCategoryOverlay() {
    const pathname = usePathname();
    const [logoSrc, setLogoSrc] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchCreateCategory>>>();

    function onCancel() {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        setLogoSrc("");
        setResult(undefined);
        setShowOverlay(false);
    }

    useEffect(() => {
        // close the overlay after creating successfully
        if (showOverlay && result?.success) {
            setShowOverlay(false);
        }
    }, [result]);

    return (
        <>
            <Tooltip title="Create a category">
                <Button
                    data-test="createCategory"
                    onClick={() => setShowOverlay(true)}
                    square={true}
                    variant="primary"
                >
                    <IconPlus></IconPlus>
                </Button>
            </Tooltip>
            {showOverlay && (
                <Overlay onClose={onCancel}>
                    <Card className="w-[480px] font-normal max-h-[800px] overflow-y-auto">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-2xl font-bold capitalize">
                                Create Category
                            </h1>
                        </div>
                        <form
                            className="flex flex-col gap-2"
                            action={async (formData: FormData) => {
                                const result = await fetchCreateCategory(
                                    {
                                        name: formData.get("name") as string,
                                        description: formData.get(
                                            "description",
                                        ) as string,
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
                                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                    hidden
                                    type="file"
                                    name="categoryLogo"
                                    id="categoryLogo"
                                />
                            </div>
                            <div className="flex flex-col items-start">
                                <label htmlFor="name" className="font-normal">
                                    Name
                                </label>
                                <InputField name="name" id="name" />
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
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Creating" : "Create"}
        </Button>
    );
}
