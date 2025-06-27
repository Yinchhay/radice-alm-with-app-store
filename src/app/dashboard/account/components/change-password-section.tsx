"use client"

import { useState, useEffect } from "react"
import Button from "@/components/Button"
import InputField from "@/components/InputField"
import FormErrorMessages from "@/components/FormErrorMessages"
import { fetchChangePassword } from "../actions"
import { useFormStatus } from "react-dom"
import { usePathname } from "next/navigation"
import { useToast } from "@/components/Toaster"
import { IconCheck } from "@tabler/icons-react"

export function ChangePasswordSection() {
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [result, setResult] = useState<any>()
  const pathname = usePathname()
  const { addToast } = useToast()

  const handleSubmit = async (formData: FormData) => {
    const res = await fetchChangePassword(
      {
        oldPassword: formData.get("oldPassword") as string,
        newPassword: formData.get("newPassword") as string,
        newConfirmPassword: formData.get("newConfirmPassword") as string,
      },
      pathname,
    )
    setResult(res)
  }

  useEffect(() => {
    if (result?.success) {
      addToast(
        <div className="flex gap-2">
          <IconCheck className="text-white bg-green-500 p-1 text-sm rounded-full" />
          <p>Successfully changed password</p>
        </div>,
      )
      setIsChangingPassword(false)
      setResult(undefined)
    }
  }, [result])

  if (!isChangingPassword) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Password</h3>
          <p className="text-sm text-gray-600">Change your account password</p>
        </div>
        <div className="flex items-center gap-2">
        <Button onClick={() => setIsChangingPassword(true)} variant="purple">
          Change Password
        </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Change Password</h3>
          <p className="text-sm text-gray-600">Enter your current password and choose a new one</p>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="oldPassword" className="block text-sm font-medium mb-1">
            Current Password
          </label>
          <InputField type="password" name="oldPassword" id="oldPassword" required />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
            New Password
          </label>
          <InputField type="password" name="newPassword" id="newPassword" required />
        </div>
        <div>
          <label htmlFor="newConfirmPassword" className="block text-sm font-medium mb-1">
            Confirm New Password
          </label>
          <InputField type="password" name="newConfirmPassword" id="newConfirmPassword" required />
        </div>
        {!result?.success && result?.errors && <FormErrorMessages errors={result?.errors} />}
        <div className="flex gap-2">
          <ChangePasswordBtn />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsChangingPassword(false)
              setResult(undefined)
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

function ChangePasswordBtn() {
  const formStatus = useFormStatus()
  return (
    <Button type="submit" disabled={formStatus.pending} variant="purple">
      {formStatus.pending ? "Updating..." : "Update Password"}
    </Button>
  )
}
