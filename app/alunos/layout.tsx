"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { useApp } from "@/components/app-provider"

export default function AlunosLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { autenticado } = useApp()

  useEffect(() => {
    if (!autenticado) router.replace("/")
  }, [autenticado, router])

  if (!autenticado) return null

  return (
    <div className="min-h-dvh bg-secondary/40">
      <AppHeader />
      <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>
    </div>
  )
}
