"use client";
import InputField from "@/components/InputField";
import { loginAction } from "./_action";
import { useFormState, useFormStatus } from "react-dom";
import Button from "@/components/Button";
import FormErrorMessages from "@/components/FormErrorMessages";

export default function LoginForm() {
    const [formState, formAction] = useFormState(loginAction, {
        errors: null,
    });

    return (
        <>
            <h1>Sign in</h1>
            <form action={formAction}>
                <label htmlFor="email">Email</label>
                <InputField name="email" id="email" />
                <br />
                <label htmlFor="password">Password</label>
                <InputField type="password" name="password" id="password" />
                <br />
                {formState.errors && (
                    <FormErrorMessages errors={formState.errors} />
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
