"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Overlay from "@/components/Overlay";
import { useEffect, useState } from "react";
import InputField from "@/components/InputField";
import FormErrorMessages from "@/components/FormErrorMessages";
import { fetchChangePassword } from "./fetch";
import { useFormStatus } from "react-dom";
import { usePathname } from "next/navigation";

export function ChangePasswordOverlay() {
    const pathname = usePathname();
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] = useState<Awaited<ReturnType<any>>>();

    function onCancel() {
        setResult(undefined);
        setShowOverlay(false);
    }

    async function onSubmit(formData: FormData) {
        const result = await fetchChangePassword(
            {
                oldPassword: formData.get("oldPassword") as string,
                newPassword: formData.get("newPassword") as string,
                newConfirmPassword: formData.get("newConfirmPassword") as string,
            },
            pathname,
        );
        setResult(result);
    }

    useEffect(() => {
        // close the overlay after creating successfully
        if (showOverlay && result?.success) {
            setShowOverlay(false);
        }
    }, [result]);

    return (
        <>
            <Button onClick={() => setShowOverlay(true)}>
                Change password
            </Button>
            {showOverlay && (
                <Overlay onClose={onCancel}>
                    <Card className="w-[480px] font-normal max-h-[800px] overflow-y-auto">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-2xl font-bold capitalize">
                                Change Password
                            </h1>
                        </div>
                        <form className="flex flex-col gap-2" action={onSubmit}>
                            <div className="flex flex-col items-start">
                                <label
                                    htmlFor="oldPassword"
                                    className="font-normal"
                                >
                                    Current password
                                </label>
                                <InputField
                                    type="password"
                                    name="oldPassword"
                                    id="oldPassword"
                                />
                            </div>
                            <div className="flex flex-col items-start">
                                <label
                                    htmlFor="newPassword"
                                    className="font-normal"
                                >
                                    New password
                                </label>
                                <InputField
                                    type="password"
                                    name="newPassword"
                                    id="newPassword"
                                />
                            </div>
                            <div className="flex flex-col items-start">
                                <label
                                    htmlFor="newConfirmPassword"
                                    className="font-normal"
                                >
                                    Confirm new password
                                </label>
                                <InputField
                                    type="password"
                                    name="newConfirmPassword"
                                    id="newConfirmPassword"
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
                                <ChangePasswordBtn />
                            </div>
                        </form>
                    </Card>
                </Overlay>
            )}
        </>
    );
}

function ChangePasswordBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Confirming" : "Confirm"}
        </Button>
    );
}
