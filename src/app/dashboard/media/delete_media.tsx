"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import FormErrorMessages from "@/components/FormErrorMessages";
import Overlay from "@/components/Overlay";
import { media } from "@/drizzle/schema";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { IconCheck, IconX } from "@tabler/icons-react";
import { fetchDeleteMediaById } from "./fetch";
import { usePathname } from "next/navigation";
import Tooltip from "@/components/Tooltip";
import { useToast } from "@/components/Toaster";

export function DeleteMediaOverlay({
    mediaOne,
}: {
    mediaOne: typeof media.$inferSelect;
}) {
    const pathname = usePathname();
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchDeleteMediaById>>>();
    const { addToast } = useToast();

    function onCancel() {
        setResult(undefined);
        setShowOverlay(false);
    }

    useEffect(() => {
        // close the overlay after deleting successfully
        if (showOverlay && result?.success) {
            addToast(
                <div className="flex gap-2">
                    <IconCheck className="text-white bg-green-500 p-1 text-sm rounded-full" />
                    <p>
                        Successfully deleted{" "}
                        <strong className="capitalize">{mediaOne.title}</strong>
                    </p>
                </div>,
            );
            onCancel();
        }
    }, [result]);

    return (
        <>
            <Tooltip className="group" title="Delete media">
                <Button
                    onClick={() => {
                        setShowOverlay(true);
                    }}
                    square
                    variant="outline"
                    className="outline-0"
                >
                    <IconX
                        size={28}
                        className="group-hover:text-red-500 transition-all"
                        stroke={1.3}
                    />
                </Button>
            </Tooltip>
            {showOverlay && (
                <Overlay
                    onClose={() => {
                        setShowOverlay(false);
                    }}
                >
                    <Card className="w-[480px] font-normal max-h-[800px] overflow-y-auto">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-2xl font-bold capitalize">
                                Delete
                            </h1>
                            <div className="">
                                <p>
                                    You are about to delete media name{" "}
                                    <strong>{mediaOne.title}</strong>
                                </p>
                            </div>
                        </div>
                        <form
                            action={async (formData: FormData) => {
                                const result = await fetchDeleteMediaById(
                                    mediaOne.id,
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
                                <DeleteMediaBtn />
                            </div>
                        </form>
                    </Card>
                </Overlay>
            )}
        </>
    );
}

function DeleteMediaBtn() {
    const formStatus = useFormStatus();
    return (
        <Button
            data-test="deleteMediaBtn"
            disabled={formStatus.pending}
            variant="danger"
        >
            {formStatus.pending ? "Deleting" : "Delete"}
        </Button>
    );
}
