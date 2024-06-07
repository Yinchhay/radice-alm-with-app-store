"use client";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Overlay from "@/components/Overlay";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import InputField from "@/components/InputField";
import FormErrorMessages from "@/components/FormErrorMessages";
import { IconEdit } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import Tooltip from "@/components/Tooltip";

export function ChangeEmailOverlay() {
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [verifyCode, setVerifyCode] = useState<boolean>(false);
    const [verifyCodeResult, setVerifyCodeResult] =
        useState<Awaited<ReturnType<any>>>();
    const [sendEmailResult, setSendEmailResult] =
        useState<Awaited<ReturnType<any>>>();

    function setIsVerifyCode() {
        return setVerifyCode(true);
    }

    function setIsSendEmail() {
        return setVerifyCode(false);
    }

    function onCancel() {
        setVerifyCodeResult(undefined);
        setSendEmailResult(undefined);
        setIsSendEmail();
        setShowOverlay(false);
    }

    useEffect(() => {
        // close the overlay after editing successfully
        if (showOverlay && verifyCodeResult?.success) {
            onCancel();
        }
    }, [verifyCodeResult]);

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
                        <div>
                            {verifyCode ? (
                                <VerifyCodeForm
                                    onCancel={onCancel}
                                    setVerifyCodeResult={setVerifyCodeResult}
                                    showOverlay={showOverlay}
                                    verifyCodeResult={verifyCodeResult}
                                />
                            ) : (
                                <ChangeEmailForm
                                    setIsVerifyCode={setIsVerifyCode}
                                    onCancel={onCancel}
                                    setSendEmailResult={setSendEmailResult}
                                    showOverlay={showOverlay}
                                    sendEmailResult={sendEmailResult}
                                />
                            )}
                        </div>
                    </Card>
                </Overlay>
            )}
        </>
    );
}

type VerifyCodeResult = Awaited<ReturnType<any>>;
function VerifyCodeForm({
    showOverlay,
    verifyCodeResult,
    setVerifyCodeResult,
    onCancel,
}: {
    showOverlay: boolean;
    verifyCodeResult: VerifyCodeResult;
    setVerifyCodeResult: (result: VerifyCodeResult) => void;
    onCancel: () => void;
}) {
    const pathname = usePathname();

    useEffect(() => {
        // close the overlay after editing successfully
        if (showOverlay && verifyCodeResult?.success) {
            onCancel();
        }
    }, [verifyCodeResult]);

    return (
        <form
            className="flex flex-col gap-2"
            action={async (formData: FormData) => {
                // setResult(result);
            }}
        >
            <div className="flex flex-col items-start">
                <label htmlFor="code" className="font-normal">
                    Code
                </label>
                <InputField name="code" id="code" />
            </div>
            {!verifyCodeResult?.success && verifyCodeResult?.errors && (
                <FormErrorMessages errors={verifyCodeResult?.errors} />
            )}
            <div className="flex justify-end gap-2 my-3">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <ConfirmVerifyCodeBtn />
            </div>
        </form>
    );
}

type SendEmaiLResult = Awaited<ReturnType<any>>;
function ChangeEmailForm({
    showOverlay,
    sendEmailResult,
    setSendEmailResult,
    setIsVerifyCode,
    onCancel,
}: {
    showOverlay: boolean;
    sendEmailResult: SendEmaiLResult;
    setIsVerifyCode: () => void;
    setSendEmailResult: (result: SendEmaiLResult) => void;
    onCancel: () => void;
}) {
    useEffect(() => {
        // close the overlay after editing successfully
        if (showOverlay && sendEmailResult?.success) {
            // go to next verification code
        }
    }, [sendEmailResult]);

    return (
        <form
            className="flex flex-col gap-2"
            action={async (formData: FormData) => {
                await new Promise((resolve) =>
                    setTimeout(() => {
                        setIsVerifyCode();
                        resolve(1);
                    }, 1000),
                );
                // setResult(result);
            }}
        >
            <div className="flex flex-col items-start">
                <label htmlFor="email" className="font-normal">
                    Email
                </label>
                <InputField type="email" name="email" id="email" />
            </div>
            {!sendEmailResult?.success && sendEmailResult?.errors && (
                <FormErrorMessages errors={sendEmailResult?.errors} />
            )}
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

function ConfirmVerifyCodeBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Confirming" : "Confirm"}
        </Button>
    );
}
