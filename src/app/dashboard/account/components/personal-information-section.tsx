"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { User } from "lucia"
import Button from "@/components/Button"
import InputField from "@/components/InputField"
import ImageWithFallback from "@/components/ImageWithFallback"
import { fileToUrl, ACCEPTED_IMAGE_TYPES } from "@/lib/file"
import { UserType } from "@/types/user"
import { useToast } from "@/components/Toaster"
import { IconCheck, IconEdit } from "@tabler/icons-react"
import { fetchUpdateProfileInformation } from "../actions"
import { usePathname } from "next/navigation"
import FormErrorMessages from "@/components/FormErrorMessages"

interface PersonalInformationSectionProps {
  user: User
  onUserUpdate: (updates: Partial<User>) => void
}

export default function PersonalInformationSection({ user, onUserUpdate }: PersonalInformationSectionProps) {
  const [result, setResult] = useState<any>()
  const [hasPhotoUpload, setHasPhotoUpload] = useState(false)
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email,
    description: user.description || "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addToast } = useToast()
  const pathname = usePathname()

  // Sync formData with user prop whenever user changes
  useEffect(() => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email,
      description: user.description || "",
    });
    setHasPhotoUpload(false);
    setUploadedPhotoUrl(null);
  }, [user]);

  // Check if any field has changed
  const isChanged =
    formData.firstName !== (user.firstName || "") ||
    formData.lastName !== (user.lastName || "") ||
    formData.description !== (user.description || "") ||
    hasPhotoUpload;

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setUploadedPhotoUrl(url)
      setHasPhotoUpload(true)
    }
  }

  const handleRemovePhoto = () => {
    setUploadedPhotoUrl(null)
    setHasPhotoUpload(true)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    // Handle profile picture removal
    const currentProfileLogo = uploadedPhotoUrl === null ? "" : (user.profileUrl ?? "")

    const res = await fetchUpdateProfileInformation(
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        skillSet: user.skillSet || [],
        description: formData.description,
        currentProfileLogo,
      },
      form,
      pathname,
    )

    setResult(res)

    if (res.success) {
      onUserUpdate({
        firstName: formData.firstName,
        lastName: formData.lastName,
        description: formData.description,
        profileUrl: uploadedPhotoUrl === null ? "" : (uploadedPhotoUrl || user.profileUrl),
      })

      addToast(
        <div className="flex gap-2">
          <IconCheck className="text-white bg-green-500 p-1 text-sm rounded-full flex-shrink-0" />
          <p>Successfully updated profile information</p>
        </div>,
      )
      setHasPhotoUpload(false)
      setUploadedPhotoUrl(null)
      setResult(undefined)
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email,
      description: user.description || "",
    })
    setHasPhotoUpload(false)
    setUploadedPhotoUrl(null)
    setResult(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="border-b pb-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Personal Information</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-start gap-6">
          {/* Profile Image */}
          <div className="relative">
            <div className="relative w-[200px] h-[200px]">
            <ImageWithFallback
                className={`aspect-square object-cover rounded-full border border-gray-300 hover:opacity-80 cursor-pointer`}
              src={fileToUrl(
                  hasPhotoUpload && uploadedPhotoUrl === null ? "" : (uploadedPhotoUrl || user.profileUrl),
                user.type === UserType.PARTNER ? "/placeholders/logo_placeholder.png" : "/placeholders/placeholder.png",
              )}
              alt={"profile"}
                width={200}
                height={200}
              onClick={handleImageClick}
            />
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                onClick={handleImageClick}
              >
                <IconEdit className="w-6 h-6 text-white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              hidden
              name="profileLogo"
              onChange={handleImageChange}
            />
            {(uploadedPhotoUrl || user.profileUrl) && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRemovePhoto}
                className="mt-2 w-full text-xs justify-center gap-0"
              >
                Remove Profile Picture
              </Button>
            )}
          </div>

          {/* Form Fields */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-xs font-medium mb-1">
                  First Name
                </label>
                <InputField
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-xs font-medium mb-1">
                  Last Name
                </label>
                <InputField
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium mb-1">
                Email
              </label>
              <div className="flex gap-2 items-center">
                <InputField id="email" type="email" value={formData.email} disabled className="flex-1" />
              </div>
              {/* <p className="text-xs text-gray-500 mt-1">
                Once you click update, we will send a verification code to your current email: {" "}
                <strong>{user.email}</strong>
              </p> */}
            </div>

            {/* <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={e => handleInputChange("description", e.target.value)}
                className="text-sm flex px-3 py-2 items-center gap-3 self-stretch rounded-lg border border-gray-400 focus:outline-2 focus:outline-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full text-black transition-all duration-150 resize-none overflow-hidden"
                rows={1}
                style={{ minHeight: 40 }}
                onInput={e => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
              />
            </div> */}

            {!result?.success && result?.errors && <FormErrorMessages errors={result?.errors} />}

            {isChanged && (
            <div className="flex gap-2">
                <Button type="submit" variant="purple">
                    Update
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
              </div>
              )}
          </div>
        </div>
      </form>
    </div>
  )
}
