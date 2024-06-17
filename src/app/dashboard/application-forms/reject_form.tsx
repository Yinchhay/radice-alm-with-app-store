"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import FormErrorMessages from "@/components/FormErrorMessages";
import Overlay from "@/components/Overlay";
import { applicationForms } from "@/drizzle/schema";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { fetchRejectApplicationFormById } from "./fetch";
import { usePathname } from "next/navigation";
import { useToast } from "@/components/Toaster";
import { IconCheck } from "@tabler/icons-react";

export function RejectApplicationFormOverlay({
    applicationForm,
}: {
    applicationForm: typeof applicationForms.$inferSelect;
}) {
    const pathname = usePathname();
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchRejectApplicationFormById>>>();
    const { addToast } = useToast();
    

    useEffect(() => {
        if (showOverlay && result?.success) {
            addToast(
                <div className="flex gap-2">
                    <IconCheck className="text-white bg-green-500 p-1 text-sm rounded-full flex-shrink-0" />
                    <p>Successfully rejected application form</p>
                </div>,
            );

            setShowOverlay(false);
        }
    }, [result]);

    return (
        <>
            <Button onClick={() => setShowOverlay(true)} variant="danger">
                Reject
            </Button>
            {showOverlay && (
                <Overlay
                    onClose={() => {
                        setShowOverlay(false);
                    }}
                >
                    <Card className="w-[480px] font-normal max-h-[800px] overflow-y-auto">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-2xl font-bold capitalize">
                                Reject
                            </h1>
                            <div className="">
                                <p>
                                    You are about to reject application form of{" "}
                                    <strong>{`${applicationForm.firstName} ${applicationForm.lastName}`}</strong>{" "}
                                    with email{" "}
                                    <strong>{applicationForm.email}</strong>.
                                </p>
                            </div>
                        </div>
                        <form
                            action={async (formData: FormData) => {
                                const result =
                                    await fetchRejectApplicationFormById(
                                        applicationForm.id,
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
                                    onClick={() => {
                                        setShowOverlay(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <RejectApplicationFormBtn />
                            </div>
                        </form>
                    </Card>
                </Overlay>
            )}
        </>
    );
}

function RejectApplicationFormBtn() {
    const formStatus = useFormStatus();
    return (
        <Button
            data-test="rejectApplicationFormBtn"
            disabled={formStatus.pending}
            variant="danger"
        >
            {formStatus.pending ? "Rejecting" : "Reject"}
        </Button>
    );
}
