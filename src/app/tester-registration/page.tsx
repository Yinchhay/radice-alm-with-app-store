import TesterRegistrationForm from "./tester-registration-form";
import Navbar from "@/components/Navbar";

export default function TesterRegistrationPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="flex items-center justify-center flex-1" style={{ minHeight: "calc(100vh - 72px)" }}>
                <div className="w-full max-w-md flex flex-col items-center px-4">
                    <h1 className="text-4xl font-bold text-black mb-10 text-center">Create your tester account</h1>
                    <TesterRegistrationForm />
                    <div className="mt-10 text-center w-full">
                        <a href="/tester-login" className="text-black underline text-base">Already have an account?</a>
                    </div>
                </div>
            </div>
        </div>
    );
} 