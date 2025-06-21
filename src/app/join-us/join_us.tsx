"use client";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import TextareaField from "@/components/TextareaField";
import { ACCEPTED_CV_TYPES } from "@/lib/file";
import { Roboto_Condensed } from "next/font/google";
import Link from "next/link";
import { useRef, useState } from "react";
import { fetchCreateApplicationForm } from "./fetch";
import { useFormStatus } from "react-dom";
import FormErrorMessages from "@/components/FormErrorMessages";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_KEY } from "@/lib/utils";
import TechButton from "@/components/TechButton";

const roboto_condensed = Roboto_Condensed({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
});

export default function JoinUsForm() {
    const [result, setResult] =
        useState<Awaited<ReturnType<typeof fetchCreateApplicationForm>>>();
    const [success, setSuccess] = useState<boolean>(false);
    const captchaRef = useRef<ReCAPTCHA>(null);

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
                                <TechButton variant="dark" text="Home Page" />
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <form
                    action={async (formData: FormData) => {
                        formData.append(
                            "captchaToken",
                            captchaRef.current?.getValue() || "",
                        );
                        captchaRef.current?.reset();
                        const result =
                            await fetchCreateApplicationForm(formData);

                        setResult(result);
                        if (result.success) {
                            setSuccess(true);
                        }
                    }}
                    className="w-[400px] mx-auto flex flex-col gap-4 mt-8 min-h-[60vh]"
                >
                    <h1
                        className={`${roboto_condensed.className} text-center font-bold text-6xl pb-4`}
                    >
                        Join Us
                    </h1>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="firstName">First Name</label>
                            <input
                                className="w-full bg-white text-black px-3 py-1 rounded-sm outline outline-1 outline-gray-300 transition-all duration-150 focus:outline-2 focus:outline-blue-400"
                                id="firstName"
                                name="firstName"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                className="w-full bg-white text-black px-3 py-1 rounded-sm outline outline-1 outline-gray-300 transition-all duration-150 focus:outline-2 focus:outline-blue-400"
                                id="lastName"
                                name="lastName"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            className="w-full bg-white text-black px-3 py-1 rounded-sm outline outline-1 outline-gray-300 transition-all duration-150 focus:outline-2 focus:outline-blue-400"
                            id="email"
                            name="email"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="reason">Reason for joining</label>
                        <textarea
                            className="w-full bg-white text-black px-3 py-1 rounded-sm outline outline-1 outline-gray-300 focus:outline-2 focus:outline-blue-400"
                            id="reason"
                            name="reason"
                            required
                        />
                    </div>
                    <div>
                        <label className="mr-2" htmlFor="cvFile">
                            CV File:
                        </label>
                        <input
                            type="file"
                            name="cvFile"
                            accept={ACCEPTED_CV_TYPES.join(",")}
                            id="cvFile"
                            required
                        />
                    </div>
                    <ReCAPTCHA sitekey={RECAPTCHA_KEY} ref={captchaRef} />
                    {!result?.success && result?.errors && (
                        <FormErrorMessages errors={result?.errors} />
                    )}
                    <div className="flex justify-end mb-4">
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
        <TechButton
            disabled={formStatus.pending}
            variant="dark"
            text={formStatus.pending ? "Applying" : "Apply"}
        />
    );
}
