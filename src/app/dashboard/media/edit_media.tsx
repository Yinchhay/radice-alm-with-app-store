"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Overlay from "@/components/Overlay";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import InputField from "@/components/InputField";
import FormErrorMessages from "@/components/FormErrorMessages";
import { IconEdit } from "@tabler/icons-react";
import { media } from "@/drizzle/schema";
import { fetchEditMediaById } from "./fetch";
import { usePathname } from "next/navigation";

export function EditMediaOverlay({
    mediaOne,
}: {
    mediaOne: typeof media.$inferSelect;
}) {
    const pathname = usePathname();
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchEditMediaById>>>();

    async function onSubmit(formData: FormData) {
        const result = await fetchEditMediaById(
            {
                mediaId: mediaOne.id,
                title: formData.get("title") as string,
                date: formData.get("date") as unknown as Date,
                description: formData.get("description") as string,
            },
            pathname,
        );
        setResult(result);
    }

    useEffect(() => {
        // close the overlay after editing successfully
        if (showOverlay && result?.success) {
            setShowOverlay(false);
        }
    }, [result]);

    return (
        <>
            <div className="group">
                <Button
                    onClick={() => setShowOverlay(true)}
                    square
                    variant="outline"
                    className="outline-0"
                >
                    <IconEdit
                        size={28}
                        className="group-hover:text-blue-500 transition-all"
                        stroke={1.3}
                    />
                </Button>
            </div>
            {showOverlay && (
                <Overlay
                    onClose={() => {
                        setShowOverlay(false);
                    }}
                >
                    <Card className="w-[300px] font-normal">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-2xl font-bold capitalize">
                                Edit Media
                            </h1>
                        </div>
                        <form className="flex flex-col gap-2" action={onSubmit}>
                            <div className="flex flex-col items-start">
                                <label htmlFor="title" className="font-normal">
                                    Title
                                </label>
                                <InputField
                                    name="title"
                                    id="title"
                                    defaultValue={mediaOne.title}
                                />
                            </div>
                            <div className="flex flex-col items-start">
                                <label
                                    htmlFor="description"
                                    className="font-normal"
                                >
                                    Description
                                </label>
                                <InputField
                                    name="description"
                                    id="description"
                                    defaultValue={mediaOne.description ?? ""}
                                />
                            </div>
                            <div className="flex flex-col items-start">
                                <label htmlFor="date" className="font-normal">
                                    Date
                                </label>
                                <InputField
                                    type="date"
                                    name="date"
                                    id="date"
                                    defaultValue={new Date(mediaOne.date).toISOString().split("T")[0]}
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
                                <EditMediaBtn />
                            </div>
                        </form>
                    </Card>
                </Overlay>
            )}
        </>
    );
}

function EditMediaBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Editing" : "Edit"}
        </Button>
    );
}
