import type React from "react"

export default function AccountLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8">{children}</div>
    </div>
  )
}
