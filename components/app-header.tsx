"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BeltIcon } from "@/components/belt-icon"
import { useApp } from "@/components/app-provider"

export function AppHeader() {
  const router = useRouter()
  const { sair } = useApp()

  function handleSair() {
    sair()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-4 px-4">
        <Link href="/alunos" className="flex items-center gap-2.5">
          <span
            className="flex size-8 items-center justify-center rounded-lg border"
            style={{ backgroundColor: "#f4f4f5", borderColor: "rgba(0,0,0,0.1)", color: "#0a0a0a" }}
          >
            <BeltIcon className="size-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-foreground">Zen&apos;yo App</span>
            <span className="text-xs text-muted-foreground">Gestão de Judô</span>
          </span>
        </Link>
        <Button variant="ghost" size="sm" onClick={handleSair}>
          <LogOut />
          Sair
        </Button>
      </div>
    </header>
  )
}
