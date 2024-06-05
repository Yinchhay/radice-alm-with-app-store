"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Overlay from "@/components/Overlay";
import { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import FormErrorMessages from "@/components/FormErrorMessages";
import { IconPlus } from "@tabler/icons-react";
import { useFormStatus } from "react-dom";
import { fetchCreatePartner } from "./fetch";
import { usePathname } from "next/navigation";

export function CreatePartnerOverlay() {
    const pathname = usePathname();
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchCreatePartner>>>();

    useEffect(() => {
        // close the overlay after creating successfully
        if (showOverlay && result?.success) {
            console.log("Created partner pw: ", result.data.password);
            setShowOverlay(false);
        }
    }, [result]);

    return (
        <>
            <Button
                data-test="createPartner"
                onClick={() => setShowOverlay(true)}
                square={true}
                variant="primary"
            >
                <IconPlus></IconPlus>
            </Button>
            {showOverlay && (
                <Overlay
                    onClose={() => {
                        setShowOverlay(false);
                    }}
                >
                    <Card className="w-[480px] font-normal flex flex-col gap-4 max-h-[800px] overflow-y-auto">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-2xl font-bold capitalize">
                                Create Partner
                            </h1>
                        </div>
                        <form
                            action={async (formData: FormData) => {
                                const result = await fetchCreatePartner({
                                    email: formData.get("email") as string,
                                    firstName: formData.get("firstName") as string,
                                    lastName: formData.get("lastName") as string,
                                }, pathname);
                                setResult(result);
                            }}
                        >
                            <div className="flex flex-col items-start my-1">
                                <label
                                    htmlFor="firstName"
                                    className="font-normal"
                                >
                                    First name
                                </label>
                                <InputField name="firstName" id="firstName" />
                            </div>
                            <div className="flex flex-col items-start my-1">
                                <label
                                    htmlFor="lastName"
                                    className="font-normal"
                                >
                                    Last name
                                </label>
                                <InputField name="lastName" id="lastName" />
                            </div>
                            <div className="flex flex-col items-start my-1">
                                <label htmlFor="email" className="font-normal">
                                    Email
                                </label>
                                <InputField
                                    type="email"
                                    name="email"
                                    id="email"
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
                                <CreatePartnerBtn />
                            </div>
                        </form>
                    </Card>
                </Overlay>
            )}
        </>
    );
}

function CreatePartnerBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Creating" : "Create"}
        </Button>
    );
}
