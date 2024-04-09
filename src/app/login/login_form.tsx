"use client";
import InputField from "@/components/InputField";
import { useFormStatus } from "react-dom";
import Button from "@/components/Button";
import FormErrorMessages from "@/components/FormErrorMessages";
import { fetchLoginCredential } from "./fetch";
import { useState } from "react";
import { redirect } from "next/navigation";

export default function LoginForm() {
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchLoginCredential>>>();

    return (
        <>
            <h1>Sign in</h1>
            <form
                action={async (formData: FormData) => {
                    const result = await fetchLoginCredential({
                        email: formData.get("email") as string,
                        password: formData.get("password") as string,
                    });

                    if (result?.success) {
                        redirect("/dashboard/manage/projects");
                    }

                    setResult(result);
                }}
            >
                <label htmlFor="email">Email</label>
                <InputField name="email" id="email" />
                <br />
                <label htmlFor="password">Password</label>
                <InputField type="password" name="password" id="password" />
                <br />
                {!result?.success && result?.errors && (
                    <FormErrorMessages errors={result?.errors} />
                )}
                <Btn />
            </form>
        </>
    );
}

function Btn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending}>
            {formStatus.pending ? "Logging in" : "Log in"}
        </Button>
    );
}
