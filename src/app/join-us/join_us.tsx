"use client";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import TextareaField from "@/components/TextareaField";
import { ACCEPTED_CV_TYPES } from "@/lib/file";
import { Roboto_Condensed } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import { fetchCreateApplicationForm } from "./fetch";
import { useFormStatus } from "react-dom";
import FormErrorMessages from "@/components/FormErrorMessages";

const roboto_condensed = Roboto_Condensed({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
});

export default function JoinUsForm() {
    const [result, setResult] = useState<Awaited<ReturnType<typeof fetchCreateApplicationForm>>>();
    const [success, setSuccess] = useState<boolean>(false);

    return (
        <div className="container mx-auto">
            {success ? (
                <div className="w-[800px] mx-auto grid place-items-center mt-16 min-h-[60vh]">
                    <div className="grid gap-2">
                        <h1
                            className={`${roboto_condensed.className} text-center font-bold text-5xl pb-4`}
                        >
                            Thank you for Applying to Radice
                        </h1>{" "}
                        <p className="text-center mb-8">
                            You will receive an email from us once your approval
                            status has been decided
                        </p>
                        <div className="flex justify-center">
                            <Link href={"/"}>
                                <Button variant="primary">
                                    Go To Home Page
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <form
                    action={async (formData: FormData) => {
                        const result =
                            await fetchCreateApplicationForm(formData);
                            
                        setResult(result);
                        if (result.success) {
                            setSuccess(true);
                        }
                    }}
                    className="w-[400px] mx-auto flex flex-col gap-4 mt-16 min-h-[60vh]"
                >
                    <h1
                        className={`${roboto_condensed.className} text-center font-bold text-5xl pb-4`}
                    >
                        Join Us
                    </h1>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="firstName">First Name</label>
                            <InputField
                                id="firstName"
                                name="firstName"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName">Last Name</label>
                            <InputField
                                id="lastName"
                                name="lastName"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <InputField id="email" name="email" required />
                    </div>
                    <div>
                        <label htmlFor="reason">Reason for joining</label>
                        <TextareaField id="reason" name="reason" required />
                    </div>
                    <div>
                        <label className="mr-2">CV File:</label>
                        <label
                            htmlFor="cvFile"
                            className="hover:brightness-90 bg-white text-black rounded-sm outline outline-1 outline-gray-300 px-3 py-1 cursor-pointer transition-all duration-150"
                        >
                            Attach a File
                            <input
                                type="file"
                                className="hidden"
                                name="cvFile"
                                accept={ACCEPTED_CV_TYPES.join(",")}
                                id="cvFile"
                                required
                            />
                        </label>
                    </div>
                    {!result?.success && result?.errors && (
                        <FormErrorMessages errors={result?.errors} />
                    )}
                    <div className="flex justify-end">
                        <ApplyBtn />
                    </div>
                </form>
            )}
        </div>
    );
}

function ApplyBtn() {
    const formStatus = useFormStatus();
    return (
        <Button disabled={formStatus.pending} variant="primary">
            {formStatus.pending ? "Applying" : "Apply"}
        </Button>
    );
}
