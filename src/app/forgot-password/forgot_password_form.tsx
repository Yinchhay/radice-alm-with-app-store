"use client";
import InputField from "@/components/InputField";
import { useFormStatus } from "react-dom";
import Button from "@/components/Button";
import FormErrorMessages from "@/components/FormErrorMessages";
import { useState } from "react";

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
    return (
        <form
            className="grid gap-4"
            action={async (formData: FormData) => {
                // const result = await fetchLoginCredential({
                //     email: formData.get("email") as string,
                //     password: formData.get("password") as string,
                // });
                // if (result.success) {
                //     redirect("/dashboard/projects");
                // }
                // setResult(result);

                setEmail(formData.get("email") as string);
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
                />
            </div>
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
    const [result, setResult] = useState<Awaited<ReturnType<any>>>();

    function onBack() {
        setResult(undefined);
        setIsEmailForm();
    }

    return (
        <form
            className="grid gap-4"
            action={async (formData: FormData) => {
                // const result = await fetchLoginCredential({
                //     email: formData.get("email") as string,
                //     password: formData.get("password") as string,
                // });
                // if (result.success) {
                //     redirect("/dashboard/projects");
                // }
                // setResult(result);
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
