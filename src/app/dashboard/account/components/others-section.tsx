"use client"

import { useState } from "react"
import type { User } from "lucia"
import Button from "@/components/Button"
import TextareaField from "@/components/TextareaField"
import SkillSetChips from "@/components/SkillSetChips"
import { UserType } from "@/types/user"

interface OthersSectionProps {
  user: User
  onUserUpdate: (updates: Partial<User>) => void
}

export default function OthersSection({ user, onUserUpdate }: OthersSectionProps) {
  const [description, setDescription] = useState(user.description || "")

  const handleSave = () => {
    onUserUpdate({ description })
  }

  const handleCancel = () => {
    setDescription(user.description || "")
  }

  const isChanged = description !== (user.description || "");

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Others</h2>
      </div>

      <div className="space-y-6">
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-xs font-medium mb-2">
            Description
          </label>
          <TextareaField
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              // auto-resize
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
            className="text-sm flex px-3 py-2 items-center gap-3 self-stretch rounded-lg border border-gray-400 focus:outline-2 focus:outline-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full text-black transition-all duration-150 resize-none overflow-hidden"
            placeholder="Tell us about yourself..."
          />

          {isChanged && (
            <div className="flex gap-2 mt-4">
              <Button onClick={handleSave} variant="purple">
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Skills */}
        {user.type === UserType.USER && user.skillSet && user.skillSet.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="font-medium mb-3">Skills</h3>
            <SkillSetChips dashboard skillSets={user.skillSet} />
          </div>
        )}
      </div>
    </div>
  )
}
