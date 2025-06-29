import { getAuthUser } from "@/auth/lucia"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import Loading from "@/components/Loading"
import AccountManagement from "./components/account-management"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Manage Account - Dashboard - Radice",
}

export default async function ManageAccount() {
  const user = await getAuthUser()

  if (!user) {
    return redirect("/login")
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto">
      <Suspense fallback={<Loading />}>
        <AccountManagement user={user} />
      </Suspense>
    </div>
  )
}
