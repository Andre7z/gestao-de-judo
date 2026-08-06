export function BeltIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      {/* faixa horizontal */}
      <rect x="1.5" y="9.5" width="7.5" height="5" rx="1" />
      <rect x="15" y="9.5" width="7.5" height="5" rx="1" />
      {/* nó central */}
      <rect x="8.5" y="8" width="7" height="8" rx="1.2" />
      {/* pontas penduradas */}
      <rect x="9.3" y="14.5" width="2" height="6" rx="1" />
      <rect x="12.7" y="14.5" width="2" height="6" rx="1" />
    </svg>
  )
}
