export default function Logo({ size = 32, text = true }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="var(--brand)" />
        <path d="M9 23V9l14 14V9" fill="none" stroke="var(--brand-ink)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {text && <span className="font-display text-xl font-bold tracking-tight">Nexora</span>}
    </span>
  );
}
