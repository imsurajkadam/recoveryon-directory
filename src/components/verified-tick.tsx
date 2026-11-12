export function VerifiedTick({ size = 20, title = "TreatmentLane Verified", className = "" }: { size?: number; title?: string; className?: string }) {
  return (
    <svg className={`verified-tick${className ? ` ${className}` : ""}`} width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={title}>
      <title>{title}</title>
      <path
        fill="var(--verified, #1f5fbf)"
        d="M12 1.5l2.4 1.75 2.96-.06.93 2.81 2.4 1.73-.9 2.82.9 2.82-2.4 1.73-.93 2.81-2.96-.06L12 22.5l-2.4-1.75-2.96.06-.93-2.81-2.4-1.73.9-2.82-.9-2.82 2.4-1.73.93-2.81 2.96.06z"
      />
      <path fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" d="M7.6 12.3l3 3 5.8-6.1" />
    </svg>
  );
}
