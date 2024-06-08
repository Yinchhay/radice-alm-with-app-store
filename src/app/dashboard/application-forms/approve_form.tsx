"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import FormErrorMessages from "@/components/FormErrorMessages";
import Overlay from "@/components/Overlay";
import { applicationForms } from "@/drizzle/schema";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
// import { fetchApproveApplicationFormById } from "./fetch";
import { usePathname } from "next/navigation";
import { fetchApproveApplicationFormById } from "./fetch";

export function ApproveApplicationFormOverlay({
    applicationForm,
}: {
    applicationForm: typeof applicationForms.$inferSelect;
}) {
    const pathname = usePathname();
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] = useState<Awaited<ReturnType<any>>>();

    useEffect(() => {
        // close the overlay after approved successfully
        if (showOverlay && result?.success) {
            setShowOverlay(false);
        }
    }, [result]);

    return (
        <>
            <Button onClick={() => setShowOverlay(true)} variant="primary">
                Approve
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
                                Approve
                            </h1>
                            <div className="">
                                <p>
                                    You are about to approve application form of{" "}
                                    <strong>{`${applicationForm.firstName} ${applicationForm.lastName}`}</strong>{" "}
                                    with email{" "}
                                    <strong>{applicationForm.email}</strong>.
                                </p>
                            </div>
                        </div>
                        <form
                            action={async (formData: FormData) => {
                                const result =
                                    await fetchApproveApplicationFormById(
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
                                <ApproveApplicationFormBtn />
                            </div>
                        </form>
                    </Card>
                </Overlay>
            )}
        </>
    );
}

function ApproveApplicationFormBtn() {
    const formStatus = useFormStatus();
    return (
        <Button
            data-test="approveApplicationFormBtn"
            disabled={formStatus.pending}
            variant="primary"
        >
            {formStatus.pending ? "Approving" : "Approve"}
        </Button>
    );
}
