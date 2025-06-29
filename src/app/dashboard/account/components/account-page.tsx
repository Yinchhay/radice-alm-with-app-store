"use client"

import type React from "react"

import { useState, useRef } from "react"
import { usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAccount } from "../hooks/use-account"
import type { User as AccountUser } from "../types"
import ProfileImage from "./profile-image"
import PasswordForm from "./password-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Github } from "lucide-react"
import { useFormStatus } from "react-dom"

// Mock user data - replace with your actual user type
interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  description: string
  profileUrl?: string
  skillSet?: Array<{ skill: string; proficiency: number[] }>
  hasLinkedGithub?: boolean
  type: "USER" | "PARTNER"
}

interface AccountPageProps {
  user?: AccountUser
}

export default function AccountPage({ user: initialUser }: AccountPageProps) {
  // Use the mock user as fallback for demo purposes
  const mockUser: User = {
    id: "1",
    firstName: "Super",
    lastName: "Admin",
    email: "lifegoalcs2@gmail.com",
    description: "Full-stack developer with expertise in React, Node.js, and cloud technologies.",
    profileUrl: "/placeholder.svg?height=128&width=128",
    skillSet: [
      { skill: "React", proficiency: [1, 2, 3] },
      { skill: "Node.js", proficiency: [1, 2] },
      { skill: "TypeScript", proficiency: [1, 2, 3] },
    ],
    hasLinkedGithub: true,
    type: "USER",
  }

  const user = initialUser || mockUser
  const { formData, isEditing, setIsEditing, updateFormData, resetForm, updateUser } = useAccount(user)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [emailVerificationStep, setEmailVerificationStep] = useState<"current" | "new">("current")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const pathname = usePathname()

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      updateUser({ profileUrl: url })
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    updateFormData(field, value)
  }

  const handleUpdateProfile = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    updateUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      description: formData.description,
    })

    toast({
      title: "Profile updated",
      description: "Your profile information has been successfully updated.",
    })

    setIsEditing(false)
  }

  const handleEmailUpdate = async () => {
    if (formData.email !== user.email) {
      setShowEmailVerification(true)
      setEmailVerificationStep("current")
    }
  }

  const handlePasswordChange = async (formData: FormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Password changed",
      description: "Your password has been successfully updated.",
    })

    setShowPasswordForm(false)
  }

  const handleEmailVerification = async (code: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (emailVerificationStep === "current") {
      setEmailVerificationStep("new")
    } else {
      updateUser({ email: formData.email })
      setShowEmailVerification(false)
      toast({
        title: "Email updated",
        description: `Your email has been changed to ${formData.email}`,
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Account</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings</p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-6">
            {/* Profile Image */}
            <ProfileImage
              src={user.profileUrl}
              alt="Profile"
              firstName={user.firstName}
              lastName={user.lastName}
              onImageChange={(file) => {
                const url = URL.createObjectURL(file)
                updateUser({ profileUrl: url })
              }}
            />

            {/* Form Fields */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="flex-1"
                  />
                  <Avatar className="w-10 h-10 bg-blue-600 text-white">
                    <AvatarFallback className="bg-blue-600 text-white">S</AvatarFallback>
                  </Avatar>
                </div>
                {formData.email !== user.email && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Once you click update, we will send a verification code to your current email:{" "}
                    <strong>{user.email}</strong>
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                ) : (
                  <>
                    <Button onClick={handleUpdateProfile}>Update</Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        resetForm()
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
                {formData.email !== user.email && (
                  <Button onClick={handleEmailUpdate} variant="secondary">
                    Update Email
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Password</Label>
              <p className="text-sm text-muted-foreground">Change your account password</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Change Password
              </Button>
              <Avatar className="w-10 h-10 bg-slate-700 text-white">
                <AvatarFallback className="bg-slate-700 text-white">S</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {showPasswordForm && (
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const form = new FormData(e.currentTarget)
                await handlePasswordChange(form)
              }}
              className="space-y-4 mt-4"
            >
              <PasswordForm />
              <PasswordSubmitButton />
            </form>
          )}

          {user.hasLinkedGithub && (
            <>
              <Separator className="my-6" />
              <div className="flex items-center justify-between">
                <div>
                  <Label>GitHub Account</Label>
                  <p className="text-sm text-muted-foreground">Change your linked GitHub account</p>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  Change GitHub Account
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Others */}
      <Card>
        <CardHeader>
          <CardTitle>Others</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              disabled={!isEditing}
              className="mt-2 min-h-[120px]"
              placeholder="Tell us about yourself..."
            />
          </div>

          {user.type === "USER" && user.skillSet && user.skillSet.length > 0 && (
            <div className="mt-6">
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.skillSet.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill.skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Verification Modal */}
      {showEmailVerification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{emailVerificationStep === "current" ? "Verify Current Email" : "Verify New Email"}</CardTitle>
              <CardDescription>
                {emailVerificationStep === "current"
                  ? `We've sent a verification code to ${user.email}`
                  : `We've sent a verification code to ${formData.email}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const code = formData.get("code") as string
                  handleEmailVerification(code)
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="verificationCode">Verification Code</Label>
                  <Input id="verificationCode" name="code" required />
                </div>
                <div className="flex gap-2">
                  <EmailVerificationButton />
                  <Button type="button" variant="outline" onClick={() => setShowEmailVerification(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function PasswordSubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="bg-purple-600 hover:bg-purple-700">
      {pending ? "Updating..." : "Update Password"}
    </Button>
  )
}

function EmailVerificationButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="bg-purple-600 hover:bg-purple-700">
      {pending ? "Verifying..." : "Verify"}
    </Button>
  )
}
