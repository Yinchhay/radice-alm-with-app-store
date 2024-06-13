"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Overlay from "@/components/Overlay";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import InputField from "@/components/InputField";
import FormErrorMessages from "@/components/FormErrorMessages";
import { usePathname } from "next/navigation";
import { User } from "lucia";
import {
    fetchChangeEmailSendEmail,
    fetchVerifyCurrentEmailCode,
    fetchVerifyNewEmailCode,
} from "./fetch";

enum FormPhase {
    NewEmail,
    VerifyOldEmailCode,
    VerifyNewEmailCode,
}

export function ChangeEmailOverlay({ user }: { user: User }) {
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [formPhase, setFormPhase] = useState<FormPhase>(FormPhase.NewEmail);
    const [email, setEmail] = useState<string>("");

    function onCancel() {
        setEmail("");
        setShowOverlay(false);
    }

    let CurrentForm: JSX.Element | null = null;

    switch (formPhase) {
        case FormPhase.NewEmail:
            CurrentForm = (
                <ChangeEmailForm
                    userEmail={user.email}
                    setFormPhase={setFormPhase}
                    onCancel={onCancel}
                    showOverlay={showOverlay}
                />
            );
            break;
        case FormPhase.VerifyOldEmailCode:
            CurrentForm = (
                <VerifyOldEmailCodeForm
                    email={email}
                    setEmail={setEmail}
                    currentEmail={user.email}
                    setFormPhase={setFormPhase}
                    onCancel={onCancel}
                    showOverlay={showOverlay}
                />
            );
            break;
        case FormPhase.VerifyNewEmailCode:
            CurrentForm = (
                <VerifyNewEmailCodeForm
                    newEmail={email}
                    setFormPhase={setFormPhase}
                    onCancel={onCancel}
                    showOverlay={showOverlay}
                />
            );
            break;
        default:
            setFormPhase(FormPhase.NewEmail);
            break;
    }

    return (
        <>
            <Button onClick={() => setShowOverlay(true)}>Change email</Button>
            {showOverlay && (
                <Overlay onClose={onCancel}>
                    <Card className="w-[480px] font-normal max-h-[800px] overflow-y-auto">
                        <div className="flex flex-col items-center gap-2">
                            <h1 className="text-2xl font-bold capitalize">
                                Change Email
                            </h1>
                        </div>
                        <div>{CurrentForm}</div>
                    </Card>
                </Overlay>
            )}
        </>
    );
}

function VerifyNewEmailCodeForm({
    showOverlay,
    newEmail,
    onCancel,
    setFormPhase,
}: {
    showOverlay: boolean;
    newEmail: string;
    onCancel: () => void;
    setFormPhase: (formPhase: FormPhase) => void;
}) {
    const pathname = usePathname();
    const [verifyNewEmailCodeResult, setVerifyNewEmailCodeResult] =
        useState<Awaited<ReturnType<any>>>();

    function back() {
        setVerifyNewEmailCodeResult(undefined);
        setFormPhase(FormPhase.VerifyOldEmailCode);
    }

    useEffect(() => {
        // close the overlay after editing successfully
        if (showOverlay && verifyNewEmailCodeResult?.success) {
            onCancel();
        }
    }, [verifyNewEmailCodeResult]);

    return (
        <form
            className="flex flex-col gap-2"
            action={async (formData: FormData) => {
                const result = await fetchVerifyNewEmailCode(
                    {
                        code: formData.get("code") as string,
                    },
                    pathname,
                );

                setVerifyNewEmailCodeResult(result);
            }}
        >
            <div className="flex flex-col items-start">
                <p className="text-sm my-2">
                    We have sent a verification code to{" "}
                    <strong>{newEmail}</strong> if it exists. Please check your
                    email and enter the code below.
                </p>
                <label htmlFor="code" className="font-normal">
                    Code
                </label>
                <InputField name="code" id="code" required />
            </div>
            {!verifyNewEmailCodeResult?.success &&
                verifyNewEmailCodeResult?.errors && (
                    <FormErrorMessages
                        errors={verifyNewEmailCodeResult?.errors}
                    />
                )}
            <div className="flex justify-end gap-2 my-3">
                <Button type="button" variant="outline" onClick={back}>
                    Back
                </Button>
                <ConfirmVerifyNewEmailCodeBtn />
            </div>
        </form>
    );
}

function VerifyOldEmailCodeForm({
    showOverlay,
    currentEmail,
    email,
    setEmail,
    onCancel,
    setFormPhase,
}: {
    showOverlay: boolean;
    currentEmail: string;
    email: string;
    setEmail: (value: string) => void;
    onCancel: () => void;
    setFormPhase: (formPhase: FormPhase) => void;
}) {
    const [verifyOldEmailCodeResult, setVerifyOldEmailCodeResult] =
        useState<Awaited<ReturnType<any>>>();

    function next() {
        setVerifyOldEmailCodeResult(undefined);
        setFormPhase(FormPhase.VerifyNewEmailCode);
    }

    function back() {
        setEmail("");
        setVerifyOldEmailCodeResult(undefined);
        setFormPhase(FormPhase.NewEmail);
    }

    useEffect(() => {
        // close the overlay after editing successfully
        if (showOverlay && verifyOldEmailCodeResult?.success) {
            next();
        }
    }, [verifyOldEmailCodeResult]);

    return (
        <form
            className="flex flex-col gap-2"
            action={async (formData: FormData) => {
                const result = await fetchVerifyCurrentEmailCode({
                    code: formData.get("code") as string,
                    currentEmail,
                    newEmail: email,
                });

                setVerifyOldEmailCodeResult(result);
            }}
        >
            <div className="flex flex-col items-start">
                <p className="text-sm my-2">
                    We have sent a verification code to{" "}
                    <strong>{currentEmail}</strong> if it exists. Please check
                    your email and enter the code below.
                </p>
                <label htmlFor="code" className="font-normal">
                    Code
                </label>
                <InputField name="code" id="code" required />
            </div>
            <div className="flex flex-col items-start">
                <label htmlFor="newEmail" className="font-normal">
                    New Email
                </label>
                <InputField
                    type="newEmail"
                    name="newEmail"
                    id="newEmail"
                    required
                    defaultValue={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            {!verifyOldEmailCodeResult?.success &&
                verifyOldEmailCodeResult?.errors && (
                    <FormErrorMessages
                        errors={verifyOldEmailCodeResult?.errors}
                    />
                )}
            <div className="flex justify-end gap-2 my-3">
                <Button type="button" variant="outline" onClick={back}>
                    Back
                </Button>
                <ConfirmVerifyOldEmailCodeBtn />
            </div>
        </form>
    );
}

function ChangeEmailForm({
    userEmail,
    showOverlay,
    setFormPhase,
    onCancel,
}: {
    userEmail: string;
    showOverlay: boolean;
    setFormPhase: (formPhase: FormPhase) => void;
    onCancel: () => void;
}) {
    function next() {
        setFormPhase(FormPhase.VerifyOldEmailCode);
    }

    return (
        <form
            className="flex flex-col gap-2"
            action={async (formData: FormData) => {
                fetchChangeEmailSendEmail({
                    currentEmail: userEmail,
                });

                await new Promise((resolve) =>
                    setTimeout(() => {
                        next();
                        resolve(1);
                    }, 250),
                );
            }}
        >
            <div className="flex flex-col items-start">
                <p className="text-sm my-2">
                    Once you click send code, we will send a verification
                    code to your current email: <strong>{userEmail}</strong>
                </p>
                <label htmlFor="currentEmail" className="font-normal">
                    Current Email
                </label>
                <InputField
                    type="currentEmail"
                    name="currentEmail"
                    id="currentEmail"
                    required
                    defaultValue={userEmail}
                    disabled
                />
            </div>
            <div className="flex justify-end gap-2 my-3">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <SendEmailCodeBtn />
            </div>
        </form>
    );
}

function SendEmailCodeBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Sending code" : "Send code"}
        </Button>
    );
}

function ConfirmVerifyOldEmailCodeBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Confirming" : "Confirm"}
        </Button>
    );
}

function ConfirmVerifyNewEmailCodeBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Confirming" : "Confirm"}
        </Button>
    );
}
