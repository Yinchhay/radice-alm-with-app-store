export interface User {
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

export interface FormData {
  firstName: string
  lastName: string
  email: string
  description: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Array<{ message: string; path: string[] }>
}
