import { ProtectedShell } from "@/components/protected-shell"

export default function AtividadesLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedShell>{children}</ProtectedShell>
}
