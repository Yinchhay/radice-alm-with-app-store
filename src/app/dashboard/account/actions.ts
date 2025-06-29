"use server"

import type { FetchChangeEmailSendEmailData } from "@/app/api/internal/account/change-email/route"
import type { FetchVerifyCurrentEmailCodeData } from "@/app/api/internal/account/change-email/verify-current-email-code/route"
import type { FetchVerifyNewEmailCodeData } from "@/app/api/internal/account/change-email/verify-new-email-code/route"
import type { FetchChangeGithubAccountData } from "@/app/api/internal/account/change-github-account/route"
import type { FetchChangePasswordData } from "@/app/api/internal/account/change-password/route"
import type {
  changeEmailSchema,
  changeGithubSchema,
  changePasswordSchema,
  updateProfileInformationFormSchema,
  verifyCurrentEmailCodeSchema,
  verifyNewEmailCodeSchema,
} from "@/app/api/internal/account/schema"
import type { FetchUpdateProfileInformation } from "@/app/api/internal/account/update-profile-information/route"
import { returnFetchErrorSomethingWentWrong, type ResponseJson } from "@/lib/response"
import { getBaseUrl, getSessionCookie } from "@/lib/server_utils"
import { revalidatePath } from "next/cache"
import type { z } from "zod"

export async function fetchUpdateProfileInformation(
  body: z.infer<typeof updateProfileInformationFormSchema>,
  formData: FormData,
  pathname: string,
): ResponseJson<FetchUpdateProfileInformation> {
  try {
    // by default, profileLogo is already in the formData if it exists
    const logo = formData.get("profileLogo")
    if (logo instanceof File && logo.size === 0) {
      formData.delete("profileLogo")
    }

    formData.append("skillSet", JSON.stringify(body.skillSet))
    formData.append("firstName", body.firstName)
    formData.append("lastName", body.lastName)
    formData.append("description", body.description)
    formData.append("currentProfileLogo", body.currentProfileLogo as string)

    const sessionId = await getSessionCookie()
    const response = await fetch(`${await getBaseUrl()}/api/internal/account/update-profile-information`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
      body: formData,
    })

    if (response.ok) {
      revalidatePath(pathname)
    }

    return await response.json()
  } catch (error: any) {
    return returnFetchErrorSomethingWentWrong(error)
  }
}

export async function fetchChangePassword(
  body: z.infer<typeof changePasswordSchema>,
  pathname: string,
): ResponseJson<FetchChangePasswordData> {
  try {
    const sessionId = await getSessionCookie()
    const response = await fetch(`${await getBaseUrl()}/api/internal/account/change-password`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
      body: JSON.stringify(body),
    })

    revalidatePath(pathname)
    return await response.json()
  } catch (error: any) {
    return returnFetchErrorSomethingWentWrong(error)
  }
}

export async function fetchChangeEmailSendEmail(
  body: z.infer<typeof changeEmailSchema>,
): ResponseJson<FetchChangeEmailSendEmailData> {
  try {
    const sessionId = await getSessionCookie()
    const response = await fetch(`${await getBaseUrl()}/api/internal/account/change-email`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
      body: JSON.stringify(body),
    })

    return await response.json()
  } catch (error: any) {
    return returnFetchErrorSomethingWentWrong(error)
  }
}

export async function fetchVerifyCurrentEmailCode(
  body: z.infer<typeof verifyCurrentEmailCodeSchema>,
): ResponseJson<FetchVerifyCurrentEmailCodeData> {
  try {
    const sessionId = await getSessionCookie()
    const response = await fetch(`${await getBaseUrl()}/api/internal/account/change-email/verify-current-email-code`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
      body: JSON.stringify(body),
    })

    return await response.json()
  } catch (error: any) {
    return returnFetchErrorSomethingWentWrong(error)
  }
}

export async function fetchVerifyNewEmailCode(
  body: z.infer<typeof verifyNewEmailCodeSchema>,
  pathname: string,
): ResponseJson<FetchVerifyNewEmailCodeData> {
  try {
    const sessionId = await getSessionCookie()
    const response = await fetch(`${await getBaseUrl()}/api/internal/account/change-email/verify-new-email-code`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
      body: JSON.stringify(body),
    })

    revalidatePath(pathname)
    return await response.json()
  } catch (error: any) {
    return returnFetchErrorSomethingWentWrong(error)
  }
}

export async function fetchChangeGithubAccount(
  body: z.infer<typeof changeGithubSchema>,
): ResponseJson<FetchChangeGithubAccountData> {
  try {
    const sessionId = await getSessionCookie()
    const response = await fetch(`${await getBaseUrl()}/api/internal/account/change-github-account`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
      body: JSON.stringify(body),
    })

    return await response.json()
  } catch (error: any) {
    return returnFetchErrorSomethingWentWrong(error)
  }
}
