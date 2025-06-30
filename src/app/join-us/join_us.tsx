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
  const [result, setResult] = useState<Awaited<ReturnType<typeof fetchCreateApplicationForm>>>();
  const [success, setSuccess] = useState<boolean>(false);
  const captchaRef = useRef<ReCAPTCHA>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex w-[600px] p-[40px] flex-col items-center gap-[40px] mx-auto">
      {success ? (
        <div className="text-center">
          <h1 className="text-5xl font-bold">Thank you for Applying to Radice</h1>
          <p className="mt-4 mb-8">You will receive an email once your approval status has been decided.</p>
          <Link href="/" className="text-white bg-black py-3 px-6 rounded-xl font-semibold hover:bg-gray-900 transition-colors">
            Home Page
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-5xl font-bold text-center">Join Us</h1>
          <form
            action={async (formData: FormData) => {
              formData.append("captchaToken", captchaRef.current?.getValue() || "");
              captchaRef.current?.reset();
              const result = await fetchCreateApplicationForm(formData);
              setResult(result);
              if (result.success) setSuccess(true);
            }}
            className="flex flex-col gap-6 w-full"
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block mb-2 text-sm font-medium">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  required
                  placeholder="First Name"
                  className="w-full h-[50px] px-4 py-3 rounded-xl border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-2 text-sm font-medium">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  required
                  placeholder="Last Name"
                  className="w-full h-[50px] px-4 py-3 rounded-xl border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="w-full h-[50px] px-4 py-3 rounded-xl border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="reason" className="block mb-2 text-sm font-medium">Reason for joining</label>
              <textarea
                id="reason"
                name="reason"
                required
                placeholder="Tell us why you want to join"
                className="w-full min-h-[120px] px-4 py-3 rounded-xl border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium" htmlFor="cvFile">CV File (.pdf)</label>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[160px] bg-white transition-colors cursor-pointer ${dragActive ? 'border-black bg-gray-50' : 'border-gray-300'}`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const file = e.dataTransfer.files[0];
                    setCvFile(file);
                    if (fileInputRef.current) {
                      const dt = new DataTransfer();
                      dt.items.add(file);
                      fileInputRef.current.files = dt.files;
                    }
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  name="cvFile"
                  accept={ACCEPTED_CV_TYPES.join(",")}
                  id="cvFile"
                  className="hidden"
                  ref={fileInputRef}
                  required
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setCvFile(file);
                  }}
                />
                <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mx-auto mb-4 text-gray-400">
                  <path d="M12 16V4m0 0l-4 4m4-4l4 4" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="4" y="16" width="16" height="4" rx="2" />
                </svg>
                <div className="text-base">
                  <span className="font-semibold underline">Click to upload</span> or drag and drop
                </div>
                <div className="text-sm text-gray-400 mt-1">.pdf only</div>
                {cvFile && (
                  <div className="mt-4 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                    Selected: <span className="font-medium">{cvFile.name}</span>
                  </div>
                )}
              </div>
            </div>
            <ReCAPTCHA sitekey={RECAPTCHA_KEY} ref={captchaRef} />
            {!result?.success && result?.errors && (
              <FormErrorMessages errors={result.errors} />
            )}
            <button
              type="submit"
              className="w-full bg-black text-white rounded-xl py-4 text-lg font-semibold hover:bg-gray-900 transition-colors"
            >
              Apply
            </button>
          </form>
          <div className="flex flex-col items-center gap-2 w-full mt-6">
            <a href="/login" className="text-sm text-gray-600 hover:text-black transition-colors">
              Already a developer?
            </a>
          </div>
        </>
      )}
    </div>
  );
}
