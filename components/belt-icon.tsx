export function BeltIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {/* faixa horizontal (parte esquerda e direita) */}
      <rect x="0.5" y="8" width="9.5" height="6" rx="1.5" />
      <rect x="14" y="8" width="9.5" height="6" rx="1.5" />
      {/* nó central */}
      <rect x="8" y="6.5" width="8" height="9" rx="1.8" />
      {/* pontas penduradas do nó */}
      <rect x="8.8" y="13.5" width="2.4" height="7.5" rx="1.2" />
      <rect x="12.8" y="13.5" width="2.4" height="7.5" rx="1.2" />
    </svg>
  )
}
