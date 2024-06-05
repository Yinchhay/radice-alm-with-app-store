import Button from "@/components/Button";
import Footer from "@/components/Footer";
import InputField from "@/components/InputField";
import Navbar from "@/components/Navbar";
import TextareaField from "@/components/TextareaField";
import { Roboto_Condensed } from "next/font/google";

const roboto_condensed = Roboto_Condensed({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
});

export default function JoinUsPage() {
    return (
        <div>
            <Navbar />
            <div className="container mx-auto">
                <form
                    action=""
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
                            <InputField id="firstName" />
                        </div>
                        <div>
                            <label htmlFor="lastName">Last Name</label>
                            <InputField id="lastName" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <InputField id="email" />
                    </div>
                    <div>
                        <label htmlFor="reason">Reason for joining</label>
                        <TextareaField id="reason" />
                    </div>
                    <div>
                        <label className="mr-2">CV File:</label>
                        <label
                            htmlFor="cv"
                            className="hover:brightness-90 bg-white text-black rounded-sm outline outline-1 outline-gray-300 px-3 py-1 cursor-pointer transition-all duration-150"
                        >
                            Attach a File
                            <input
                                type="file"
                                className="hidden"
                                name="cv"
                                accept=".pdf, .doc, .docx"
                                required
                                id="cv"
                            />
                        </label>
                    </div>
                    <div className="flex justify-end">
                        <Button variant="primary">Apply to Join</Button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}
