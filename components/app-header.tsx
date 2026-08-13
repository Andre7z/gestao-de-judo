"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, Users, ClipboardList, CalendarDays, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BeltIcon } from "@/components/belt-icon"
import { useApp } from "@/components/app-provider"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/alunos", rotulo: "Alunos", icone: Users },
  { href: "/atividades", rotulo: "Atividades", icone: ClipboardList },
  { href: "/calendario", rotulo: "Calendário", icone: CalendarDays },
  { href: "/anexos", rotulo: "Anexos", icone: Paperclip },
]

export function AppHeader() {
  const router = useRouter()
  const pathname = usePathname()
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
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-semibold text-foreground">Zen&apos;yo App</span>
            <span className="text-xs text-muted-foreground">Gestão de Judô</span>
          </span>
        </Link>

        <Button variant="ghost" size="sm" onClick={handleSair}>
          <LogOut />
          Sair
        </Button>
      </div>

      <nav className="mx-auto max-w-4xl px-2">
        <ul className="flex items-center gap-1 overflow-x-auto">
          {NAV.map((item) => {
            const ativo = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icone = item.icone
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
                    ativo
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icone className="size-4" />
                  {item.rotulo}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
