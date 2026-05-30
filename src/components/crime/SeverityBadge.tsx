import type { Severity } from "@/lib/crime-data";

export function SeverityBadge({ severity }: { severity: Severity }) {
  const styles: Record<Severity, { bg: string; glow: string }> = {
    High: { bg: "var(--severity-high)", glow: "glow-high" },
    Medium: { bg: "var(--severity-medium)", glow: "glow-medium" },
    Low: { bg: "var(--severity-low)", glow: "glow-low" },
  };
  const s = styles[severity];
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ${s.glow}`}
      style={{ backgroundColor: s.bg }}
    >
      {severity}
    </span>
  );
}