"use client"

import { useState } from "react"
import type { User, FormData } from "../types"

export function useAccount(initialUser: User) {
  const [user, setUser] = useState<User>(initialUser)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    description: user.description,
  })

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      description: user.description,
    })
    setIsEditing(false)
  }

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }))
  }

  return {
    user,
    formData,
    isEditing,
    setIsEditing,
    updateFormData,
    resetForm,
    updateUser,
  }
}
