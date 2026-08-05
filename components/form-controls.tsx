import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Label({
  children,
  htmlFor,
  obrigatorio,
}: {
  children: ReactNode
  htmlFor?: string
  obrigatorio?: boolean
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-foreground">
      {children}
      {obrigatorio && (
        <span className="ml-0.5 text-destructive" aria-hidden="true">
          *
        </span>
      )}
    </label>
  )
}

const baseCampo =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/30 disabled:opacity-50 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/20"

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(baseCampo, className)} {...props} />
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select className={cn(baseCampo, "appearance-none bg-no-repeat", className)} {...props}>
      {children}
    </select>
  )
}

export function ErroCampo({ children }: { children?: ReactNode }) {
  if (!children) return null
  return (
    <p className="mt-1.5 text-sm text-destructive" role="alert">
      {children}
    </p>
  )
}

export function Campo({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}
