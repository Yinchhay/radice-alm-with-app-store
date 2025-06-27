"use client"

import { useState, useEffect } from "react"
import type { User } from "lucia"
import Button from "@/components/Button"
import InputField from "@/components/InputField"
import FormErrorMessages from "@/components/FormErrorMessages"
import { useFormStatus } from "react-dom"
import { usePathname } from "next/navigation"
import { useToast } from "@/components/Toaster"
import { IconCheck } from "@tabler/icons-react"
import { fetchChangeEmailSendEmail, fetchVerifyCurrentEmailCode, fetchVerifyNewEmailCode } from "../actions"

enum FormPhase {
  NewEmail = 0,
  VerifyOldEmailCode = 1,
  VerifyNewEmailCode = 2,
}

interface ChangeEmailSectionProps {
  user: User
  onUserUpdate?: (updates: Partial<User>) => void
}

export function ChangeEmailSection({ user, onUserUpdate }: ChangeEmailSectionProps) {
  const [isChangingEmail, setIsChangingEmail] = useState(false)
  const [formPhase, setFormPhase] = useState<FormPhase>(FormPhase.NewEmail)
  const [newEmail, setNewEmail] = useState<string>("")
  const [result, setResult] = useState<any>()
  const pathname = usePathname()
  const { addToast } = useToast()

  const resetEmailChange = () => {
    setIsChangingEmail(false)
    setFormPhase(FormPhase.NewEmail)
    setNewEmail("")
    setResult(undefined)
  }

  useEffect(() => {
    // Only update parent user state after the FINAL email verification (new email code)
    if (result?.success && formPhase === FormPhase.VerifyNewEmailCode) {
      addToast(
        <div className="flex gap-2">
          <IconCheck className="text-white bg-green-500 p-1 text-sm rounded-full flex-shrink-0" />
          <p>
            Successfully changed email to <strong>{newEmail}</strong>
          </p>
        </div>,
      )
      onUserUpdate?.({ email: newEmail })
      resetEmailChange()
    }
  }, [result, formPhase])

  if (!isChangingEmail) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Email</h3>
          <p className="text-sm text-gray-600">Change your email address</p>
          <p className="text-sm text-gray-500">
            Current: <strong>{user.email}</strong>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsChangingEmail(true)} variant="outline">Change Email</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Change Email</h3>
          <p className="text-sm text-gray-600">
            {formPhase === FormPhase.NewEmail && "We'll send a verification code to your current email"}
            {formPhase === FormPhase.VerifyOldEmailCode && "Verify your current email address"}
            {formPhase === FormPhase.VerifyNewEmailCode && "Verify your new email address"}
          </p>
        </div>
      </div>

      {formPhase === FormPhase.NewEmail && (
        <ChangeEmailForm userEmail={user.email} setFormPhase={setFormPhase} onCancel={resetEmailChange} setNewEmail={setNewEmail} />
      )}

      {formPhase === FormPhase.VerifyOldEmailCode && (
        <VerifyOldEmailCodeForm
          currentEmail={user.email}
          newEmail={newEmail}
          setFormPhase={setFormPhase}
          onCancel={resetEmailChange}
          setResult={setResult}
          result={result}
        />
      )}

      {formPhase === FormPhase.VerifyNewEmailCode && (
        <VerifyNewEmailCodeForm
          newEmail={newEmail}
          setFormPhase={setFormPhase}
          onCancel={resetEmailChange}
          setResult={setResult}
          result={result}
          pathname={pathname}
        />
      )}
    </div>
  )
}

function ChangeEmailForm({
  userEmail,
  setFormPhase,
  onCancel,
  setNewEmail,
}: {
  userEmail: string
  setFormPhase: (phase: FormPhase) => void
  onCancel: () => void
  setNewEmail: (email: string) => void
}) {
  const [newEmailInput, setNewEmailInput] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowMessage(true);
    setNewEmail(newEmailInput);
    await fetchChangeEmailSendEmail({
      currentEmail: userEmail,
    });
    await new Promise((resolve) =>
      setTimeout(() => {
        setFormPhase(FormPhase.VerifyOldEmailCode);
        resolve(1);
      }, 250),
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="currentEmail" className="block text-sm font-medium mb-1">
          Current Email
        </label>
        <InputField type="email" name="currentEmail" id="currentEmail" defaultValue={userEmail} disabled />
      </div>
      <div>
        <label htmlFor="newEmail" className="block text-sm font-medium mb-1">
          New Email
        </label>
        <InputField
          type="email"
          name="newEmail"
          id="newEmail"
          value={newEmailInput}
          onChange={e => setNewEmailInput(e.target.value)}
          placeholder="Enter your new email address"
          required
        />
      </div>
      {showMessage && (
        <p className="text-sm text-gray-500 mt-1">
          Once you click update, we will send a verification code to your current email: {userEmail}
        </p>
      )}
      <div className="flex gap-2">
        <Button type="submit" variant="purple">Update</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function VerifyOldEmailCodeForm({
  currentEmail,
  newEmail,
  setFormPhase,
  onCancel,
  setResult,
  result,
}: {
  currentEmail: string
  newEmail: string
  setFormPhase: (phase: FormPhase) => void
  onCancel: () => void
  setResult: (result: any) => void
  result: any
}) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const res = await fetchVerifyCurrentEmailCode({
      code: formData.get("code") as string,
      currentEmail,
      newEmail,
    });
    setResult(res);
    setSubmitting(false);
    if (res.success) {
      setFormPhase(FormPhase.VerifyNewEmailCode);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm mb-4">
          We have sent a verification code to <strong>{currentEmail}</strong>. Please check your email and enter the
          code below.
        </p>
        <label htmlFor="code" className="block text-sm font-medium mb-1">
          Verification Code
        </label>
        <InputField name="code" id="code" placeholder="Enter 6-digit code" required />
      </div>
      {!result?.success && result?.errors && <FormErrorMessages errors={result?.errors} />}
      <div className="flex gap-2">
        <Button type="submit" variant="primary" disabled={submitting}>{submitting ? "Verifying..." : "Verify"}</Button>
      </div>
    </form>
  );
}

function VerifyNewEmailCodeForm({
  newEmail,
  setFormPhase,
  onCancel,
  setResult,
  result,
  pathname,
}: {
  newEmail: string
  setFormPhase: (phase: FormPhase) => void
  onCancel: () => void
  setResult: (result: any) => void
  result: any
  pathname: string
}) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const res = await fetchVerifyNewEmailCode(
      {
        code: formData.get("code") as string,
      },
      pathname,
    );
    setResult(res);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm mb-4">
          We have sent a verification code to <strong>{newEmail}</strong>. Please check your email and enter the code
          below.
        </p>
        <label htmlFor="code" className="block text-sm font-medium mb-1">
          Verification Code
        </label>
        <InputField name="code" id="code" placeholder="Enter 6-digit code" required />
      </div>
      {!result?.success && result?.errors && <FormErrorMessages errors={result?.errors} />}
      <div className="flex gap-2">
        <Button type="submit" variant="primary" disabled={submitting}>{submitting ? "Verifying..." : "Verify"}</Button>
        <Button type="button" variant="outline" onClick={() => setFormPhase(FormPhase.VerifyOldEmailCode)}>
          Back
        </Button>
      </div>
    </form>
  );
}

function SendEmailCodeBtn() {
  const formStatus = useFormStatus()
  return (
    <Button disabled={formStatus.pending} variant="primary">
      {formStatus.pending ? "Sending code" : "Send code"}
    </Button>
  )
}

function ConfirmVerifyOldEmailCodeBtn() {
  const formStatus = useFormStatus()
  return (
    <Button disabled={formStatus.pending} variant="primary">
      {formStatus.pending ? "Confirming" : "Confirm"}
    </Button>
  )
}

function ConfirmVerifyNewEmailCodeBtn() {
  const formStatus = useFormStatus()
  return (
    <Button disabled={formStatus.pending} variant="primary">
      {formStatus.pending ? "Confirming" : "Confirm"}
    </Button>
  )
}
