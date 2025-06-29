"use client"

import { useState } from "react"
import type { User } from "lucia"
import PersonalInformationSection from "./personal-information-section"
import SecuritySection from "./security-section"
import OthersSection from "./others-section"

interface AccountManagementProps {
  user: User
}

export default function AccountManagement({ user }: AccountManagementProps) {
  const [currentUser, setCurrentUser] = useState(user)

  const updateUser = (updates: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Account</h1>
        <p className="text-gray-600 mt-2">Manage your account settings</p>
      </div>

      {/* Personal Information */}
      <PersonalInformationSection user={currentUser} onUserUpdate={updateUser} />

      {/* Security */}
      <SecuritySection user={currentUser} onUserUpdate={updateUser} />

      {/* Others */}
      <OthersSection user={currentUser} onUserUpdate={updateUser} />
    </div>
  )
}
