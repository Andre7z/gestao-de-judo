import { ProtectedShell } from "@/components/protected-shell"

export default function AnexosLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedShell>{children}</ProtectedShell>
}
