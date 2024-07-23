"use client";
import InputField from "@/components/InputField";
import { useFormStatus } from "react-dom";
import Button from "@/components/Button";
import FormErrorMessages from "@/components/FormErrorMessages";
import { useRef, useState } from "react";
import {
    fetchForgotPasswordSendEmail,
    fetchVerifyForgotPasswordCode,
} from "./fetch";
import { redirect } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_KEY } from "@/lib/utils";

export default function ForgotPasswordForm() {
    const [isVerifyForm, setIsVerifyForm] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");

    function setIsEmailForm() {
        return setIsVerifyForm(false);
    }

    function setIsVerifyCodeForm() {
        return setIsVerifyForm(true);
    }

    return (
        <div className="w-[400px]">
            <h1 className="text-4xl font-bold text-center mb-4">
                Forgot password
            </h1>
            <div className="">
                {isVerifyForm ? (
                    <VerifyCodeForm
                        setIsEmailForm={setIsEmailForm}
                        email={email}
                    />
                ) : (
                    <EmailForm
                        email={email}
                        setIsVerifyCodeForm={setIsVerifyCodeForm}
                        setEmail={setEmail}
                    />
                )}
            </div>
        </div>
    );
}

function EmailForm({
    email,
    setEmail,
    setIsVerifyCodeForm,
}: {
    email: string;
    setEmail: (email: string) => void;
    setIsVerifyCodeForm: () => void;
}) {
    const captchaRef = useRef<ReCAPTCHA>(null);
    const [captchaError, setCaptchaError] = useState<{
        captcha: string;
    } | null>(null);

    return (
        <form
            className="grid gap-4"
            action={async (formData: FormData) => {
                if (!captchaRef.current?.getValue()) {
                    setCaptchaError({ captcha: "Please complete the captcha" });
                    return;
                }

                fetchForgotPasswordSendEmail({
                    email: formData.get("email") as string,
                    captchaToken: captchaRef.current?.getValue() || "",
                });

                captchaRef.current?.reset();
                // we don't care about the result, just move to the next form
                // simulate a delay to make it look like we're doing something xD
                await new Promise((resolve) => {
                    setTimeout(() => {
                        setIsVerifyCodeForm();
                        resolve(1);
                    }, 250);
                });
            }}
        >
            <div>
                <label htmlFor="email">Email</label>
                <InputField
                    name="email"
                    id="email"
                    required
                    defaultValue={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <ReCAPTCHA sitekey={RECAPTCHA_KEY} ref={captchaRef} />
            {captchaError && <FormErrorMessages errors={captchaError} />}
            <div className="flex justify-end gap-2 my-3">
                <EmailFormButton />
            </div>
        </form>
    );
}

function VerifyCodeForm({
    setIsEmailForm,
    email,
}: {
    setIsEmailForm: () => void;
    email: string;
}) {
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchVerifyForgotPasswordCode>>>();
    const captchaRef = useRef<ReCAPTCHA>(null);

    function onBack() {
        setResult(undefined);
        setIsEmailForm();
    }

    return (
        <form
            className="grid gap-4"
            action={async (formData: FormData) => {
                const result = await fetchVerifyForgotPasswordCode({
                    email: email,
                    newPassword: formData.get("newPassword") as string,
                    code: formData.get("code") as string,
                    captchaToken: captchaRef.current?.getValue() || "",
                    newConfirmPassword: formData.get("confirmNewPassword") as string,
                });

                captchaRef.current?.reset();
                if (result.success) {
                    redirect(
                        "/login?message=Password reset successfully. Please login.",
                    );
                }
                setResult(result);
            }}
        >
            <div>
                <p className="text-sm my-2">
                    We have sent a verification code to <strong>{email}</strong>{" "}
                    if it exists. Please check your email and enter the code
                    below.
                </p>
                <label htmlFor="code">Verification code</label>
                <InputField name="code" id="code" required />
            </div>
            <div>
                <label htmlFor="newPassword">New password</label>
                <InputField
                    name="newPassword"
                    id="newPassword"
                    type="password"
                    required
                />
            </div>
            <div>
                <label htmlFor="confirmNewPassword">Confirm new password</label>
                <InputField
                    name="confirmNewPassword"
                    id="confirmNewPassword"
                    type="password"
                    required
                />
            </div>
            <ReCAPTCHA sitekey={RECAPTCHA_KEY} ref={captchaRef} />
            {!result?.success && result?.errors && (
                <FormErrorMessages errors={result?.errors} />
            )}
            <div className="flex justify-end gap-2 my-3">
                <Button type="button" variant="outline" onClick={onBack}>
                    Back
                </Button>
                <VerifyButton />
            </div>
        </form>
    );
}

function EmailFormButton() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Confirming" : "Confirm"}
        </Button>
    );
}

function VerifyButton() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Verifying" : "Verify"}
        </Button>
    );
}
