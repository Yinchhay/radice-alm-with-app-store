"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import FormErrorMessages from "@/components/FormErrorMessages";
import InputField from "@/components/InputField";
import Overlay from "@/components/Overlay";
import { IconBrandGithub, IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { fetchChangeGithubAccount } from "./fetch";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/Toaster";

export default function ChangeGithub() {
    const searchParams = useSearchParams();
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchChangeGithubAccount>>>();
    const { addToast } = useToast();
    const router = useRouter();

    function onCancel() {
        setResult(undefined);
        setShowOverlay(false);
    }

    async function onSubmit(formData: FormData) {
        const res = await fetchChangeGithubAccount({
            oldPassword: formData.get("oldPassword") as string,
        });

        setResult(res);
    }

    useEffect(() => {
        // close the overlay after creating successfully
        if (showOverlay && result?.success) {
            router.push(
                `/api/oauth/github/verify-change-account?verify_code=${result.data.verifyCode}`,
            );
        }
    }, [result]);

    useEffect(() => {
        if (searchParams.has("success") && searchParams.get("success")) {
            addToast(
                <div className="flex gap-2">
                    <IconCheck className="text-white bg-green-500 p-1 text-sm rounded-full" />
                    <p>Successfully changed github account</p>
                </div>,
            );
            onCancel();
        }

        if (searchParams.has("error_message")) {
            const errorMessage = searchParams.get("error_message");
            addToast(
                <div className="flex gap-2">
                    <IconX className="text-white bg-red-500 rounded-full flex-shrink-0" />
                    {errorMessage}
                </div>,
            );
            onCancel();
        }
    }, [searchParams]);

    return (
        <>
            <Button className="flex gap-2" onClick={() => setShowOverlay(true)}>
                <IconBrandGithub />
                Change github account
            </Button>
            {showOverlay && (
                <Overlay onClose={onCancel}>
                    <Card className="w-[480px] font-normal max-h-[800px] overflow-y-auto">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-2xl font-bold capitalize">
                                Change github account
                            </h1>
                        </div>
                        <form className="flex flex-col gap-2" action={onSubmit}>
                            <div className="flex flex-col items-start">
                                <p className="text-sm my-2">
                                    <strong>Important</strong>: In order to
                                    change github account, make sure you have
                                    two github accounts logged in or logged in
                                    with the account you want to change to. If
                                    you have two accounts logged in, you will be
                                    redirected to github to choose new account.
                                    Be sure to choose the correct account.
                                </p>
                                <label
                                    htmlFor="oldPassword"
                                    className="font-normal"
                                >
                                    Current password
                                </label>
                                <InputField
                                    required
                                    type="password"
                                    name="oldPassword"
                                    id="oldPassword"
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
                                <ConfirmBtn />
                            </div>
                        </form>
                    </Card>
                </Overlay>
            )}
        </>
    );
}

function ConfirmBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Confirming" : "Confirm"}
        </Button>
    );
}
