"use client";
import InputField from "@/components/InputField";
import { useFormStatus } from "react-dom";
import Button from "@/components/Button";
import FormErrorMessages from "@/components/FormErrorMessages";
import { fetchLoginCredential } from "./fetch";
import { useRef, useState } from "react";
import { redirect } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_KEY } from "@/lib/utils";

export default function LoginForm() {
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchLoginCredential>>>();
    const captchaRef = useRef<ReCAPTCHA>(null);

    return (
        <div className="w-[400px]">
            <h1 className="text-4xl font-bold text-center mb-4">Login</h1>
            <form
                className="grid gap-4"
                action={async (formData: FormData) => {
                    const result = await fetchLoginCredential({
                        email: formData.get("email") as string,
                        password: formData.get("password") as string,
                        captchaToken: captchaRef.current?.getValue() || "",
                    });

                    if (result.success) {
                        redirect("/dashboard/projects");
                    }

                    setResult(result);
                }}
            >
                <div>
                    <label htmlFor="email">Email</label>
                    <InputField name="email" id="email" required />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <InputField
                        type="password"
                        name="password"
                        id="password"
                        required
                    />
                </div>
                <ReCAPTCHA sitekey={RECAPTCHA_KEY} ref={captchaRef} />
                {!result?.success && result?.errors && (
                    <FormErrorMessages errors={result?.errors} />
                )}
                <Btn />
            </form>
        </div>
    );
}

function Btn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Logging in" : "Log in"}
        </Button>
    );
}
