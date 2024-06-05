"use client";
import Button from "@/components/Button";
import Footer from "@/components/Footer";
import InputField from "@/components/InputField";
import Navbar from "@/components/Navbar";
import TextareaField from "@/components/TextareaField";
import { Roboto_Condensed } from "next/font/google";
import Link from "next/link";
import { useState } from "react";

const roboto_condensed = Roboto_Condensed({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
});

export default function JoinUsPage() {
    const [success, setSuccess] = useState(false);
    return (
        <div>
            <Navbar />
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
                                You will receive an email from us once your
                                approval status has been decided
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
                        action=""
                        onSubmit={() => setSuccess(true)}
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
                                <InputField id="firstName" name="firstName" />
                            </div>
                            <div>
                                <label htmlFor="lastName">Last Name</label>
                                <InputField id="lastName" name="lastName" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <InputField id="email" name="email" />
                        </div>
                        <div>
                            <label htmlFor="reason">Reason for joining</label>
                            <TextareaField id="reason" name="reason" />
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
                                    accept=".pdf, .doc, .docx"
                                    id="cvFile"
                                />
                            </label>
                        </div>
                        <div className="flex justify-end">
                            <Button variant="primary" type="submit">
                                Apply to Join
                            </Button>
                        </div>
                    </form>
                )}
            </div>
            <Footer />
        </div>
    );
}
