"use client"

import { useState, useEffect } from "react"
import Button from "@/components/Button"
import InputField from "@/components/InputField"
import FormErrorMessages from "@/components/FormErrorMessages"
import { IconBrandGithub, IconCheck, IconX } from "@tabler/icons-react"
import { useFormStatus } from "react-dom"
import { fetchChangeGithubAccount } from "../actions"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/components/Toaster"

export function ChangeGithubSection() {
  const [isChangingGithub, setIsChangingGithub] = useState(false)
  const [result, setResult] = useState<any>()
  const { addToast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = async (formData: FormData) => {
    const res = await fetchChangeGithubAccount({
      oldPassword: formData.get("oldPassword") as string,
    })
    setResult(res)
  }

  useEffect(() => {
    if (result?.success) {
      router.push(`/api/oauth/github/verify-change-account?verify_code=${result.data.verifyCode}`)
    }
  }, [result])

  useEffect(() => {
    if (searchParams.has("success") && searchParams.get("success")) {
      addToast(
        <div className="flex gap-2">
          <IconCheck className="text-white bg-green-500 p-1 text-sm rounded-full" />
          <p>Successfully changed github account</p>
        </div>,
      )
      setIsChangingGithub(false)
      setResult(undefined)
    }

    if (searchParams.has("error_message")) {
      const errorMessage = searchParams.get("error_message")
      addToast(
        <div className="flex gap-2">
          <IconX className="text-white bg-red-500 rounded-full flex-shrink-0" />
          {errorMessage}
        </div>,
      )
      setIsChangingGithub(false)
      setResult(undefined)
    }
  }, [searchParams])

  if (!isChangingGithub) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">GitHub Account</h3>
          <p className="text-sm text-gray-600">Change your linked GitHub account</p>
        </div>
        <Button className="flex gap-2" onClick={() => setIsChangingGithub(true)}>
          <IconBrandGithub />
          Change GitHub Account
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Change GitHub Account</h3>
          <p className="text-sm text-gray-600">Verify your password to change your GitHub account</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setIsChangingGithub(false)
            setResult(undefined)
          }}
        >
          Cancel
        </Button>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <strong>Important:</strong> Make sure you have two GitHub accounts logged in or are logged in with the
            account you want to change to. You will be redirected to GitHub to choose the new account.
          </p>
          <label htmlFor="oldPassword" className="block text-sm font-medium mb-1">
            Current Password
          </label>
          <InputField required type="password" name="oldPassword" id="oldPassword" />
        </div>
        {!result?.success && result?.errors && <FormErrorMessages errors={result?.errors} />}
        <div className="flex gap-2">
          <ConfirmBtn />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsChangingGithub(false)
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

function ConfirmBtn() {
  const formStatus = useFormStatus()
  return (
    <Button disabled={formStatus.pending} variant="primary">
      {formStatus.pending ? "Confirming" : "Confirm"}
    </Button>
  )
}
