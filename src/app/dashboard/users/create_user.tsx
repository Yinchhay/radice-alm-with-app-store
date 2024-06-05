"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Overlay from "@/components/Overlay";
import InputField from "@/components/InputField";
import FormErrorMessages from "@/components/FormErrorMessages";
import { IconPlus } from "@tabler/icons-react";
import { generatePassword } from "@/lib/utils";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { usePathname } from "next/navigation";

import { fetchCreateUser } from "./fetch";
import Tooltip from "@/components/Tooltip";

export function CreateUserOverlay() {
    const pathname = usePathname();
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchCreateUser>>>();

    useEffect(() => {
        // close the overlay after creating successfully
        if (showOverlay && result?.success) {
            setShowOverlay(false);
        }
    }, [result]);

    return (
        <>
            <Tooltip title="Create a user">
                <Button
                    data-test="createUser"
                    onClick={() => setShowOverlay(true)}
                    square={true}
                    variant="primary"
                >
                    <IconPlus></IconPlus>
                </Button>
            </Tooltip>
            {showOverlay && (
                <div className="font-normal">
                    <Overlay
                        onClose={() => {
                            setShowOverlay(false);
                        }}
                    >
                        <Card className="w-[480px] font-normal flex flex-col gap-4 max-h-[800px] overflow-y-auto">
                            <div className="flex flex-col items-center gap-2">
                                <h1 className="text-2xl font-bold capitalize">
                                    Create User
                                </h1>
                            </div>
                            <form
                                action={async (formData: FormData) => {
                                    const generatedPassword =
                                        generatePassword();
                                    const result = await fetchCreateUser({
                                        firstName: formData.get(
                                            "firstName",
                                        ) as string,
                                        lastName: formData.get(
                                            "lastName",
                                        ) as string,
                                        email: formData.get("email") as string,
                                        password: generatedPassword,
                                    }, pathname);
                                    console.log(generatedPassword)
                                    setResult(result);
                                }}
                            >
                                <div className="flex flex-col items-start my-1">
                                    <label
                                        htmlFor="firstName"
                                        className="font-normal"
                                    >
                                        First Name
                                    </label>
                                    <InputField
                                        name="firstName"
                                        id="firstName"
                                    />
                                </div>
                                <div className="flex flex-col items-start my-1">
                                    <label
                                        htmlFor="lastName"
                                        className="font-normal"
                                    >
                                        Last Name
                                    </label>
                                    <InputField name="lastName" id="lastName" />
                                </div>
                                <div className="flex flex-col items-start my-1">
                                    <label
                                        htmlFor="email"
                                        className="font-normal"
                                    >
                                        Email
                                    </label>
                                    <InputField name="email" id="email" />
                                </div>
                                {!result?.success && result?.errors && (
                                    <FormErrorMessages
                                        errors={result?.errors}
                                    />
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
                                    <CreateUserBtn />
                                </div>
                            </form>
                        </Card>
                    </Overlay>
                </div>
            )}
        </>
    );
}

function CreateUserBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Creating" : "Create"}
        </Button>
    );
}
