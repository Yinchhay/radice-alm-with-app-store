"use client"

import type { User } from "lucia"
import { ChangePasswordSection } from "./change-password-section"
import { ChangeEmailSection } from "./change-email-overlay"
import { ChangeGithubSection } from "./change-github-section"

interface SecuritySectionProps {
  user: User
  onUserUpdate?: (updates: Partial<User>) => void
}

export default function SecuritySection({ user, onUserUpdate }: SecuritySectionProps) {
  return (
    <div className="border-b pb-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Security</h2>
      </div>

      <div className="space-y-6">
        {/* Password */}
        <ChangePasswordSection />

        {/* Email */}
        <div className="border-t pt-6">
          <ChangeEmailSection user={user} onUserUpdate={onUserUpdate} />
        </div>

        {/* GitHub Account */}
        {user.hasLinkedGithub && (
          <div className="border-t pt-6">
            <ChangeGithubSection />
          </div>
        )}
      </div>
    </div>
  )
}
