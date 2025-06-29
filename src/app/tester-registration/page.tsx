import TesterRegistrationForm from "./tester-registration-form";

export default function TesterRegistrationPage() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-full max-w-md flex flex-col items-center px-4">
                <h1 className="text-4xl font-bold text-black mb-10 text-center">Create your tester account</h1>
                <TesterRegistrationForm />
                <div className="mt-10 text-center w-full">
                    <a href="/tester-login" className="text-black underline text-base">Already have an account?</a>
                </div>
            </div>
        </div>
    );
} 