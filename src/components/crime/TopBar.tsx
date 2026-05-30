import { Activity, LogOut, Pause, Play, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopBar({
  live,
  onToggle,
  todayCount,
  activeCount,
  clock,
  onSignOut,
}: {
  live: boolean;
  onToggle: () => void;
  todayCount: number;
  activeCount: number;
  clock: string;
  onSignOut?: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 flex flex-wrap items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-2">
        <span
          className="pulse-dot-red inline-block h-2.5 w-2.5 rounded-full"
          style={{ background: "var(--severity-high)" }}
        />
        <Shield className="h-5 w-5 text-foreground" />
        <h1 className="text-base font-bold tracking-tight md:text-lg">
          CrimeWatch Live <span className="font-normal text-muted-foreground">— Chennai</span>
        </h1>
      </div>

      <div className="ml-2 flex items-center gap-2">
        {live ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">
            <span className="pulse-dot inline-block h-2 w-2 rounded-full" style={{ background: "var(--live)" }} />
            <span style={{ color: "var(--live)" }}>Live</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: "var(--severity-high)" }} />
            <span style={{ color: "var(--severity-high)" }}>Paused</span>
          </span>
        )}
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <StatPill label="Today" value={todayCount} />
        <StatPill label="Active" value={activeCount} icon />
        <Button onClick={onToggle} variant="outline" size="sm" className="gap-1.5">
          {live ? (
            <>
              <Pause className="h-3.5 w-3.5" /> Pause
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" /> Resume
            </>
          )}
        </Button>
        <span className="font-mono-tabular hidden text-xs text-muted-foreground sm:inline">{clock}</span>
        {onSignOut && (
          <Button onClick={onSignOut} variant="ghost" size="sm" className="gap-1.5">
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </Button>
        )}
      </div>
    </header>
  );
}

function StatPill({ label, value, icon }: { label: string; value: number; icon?: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1">
      {icon && <Activity className="h-3.5 w-3.5 text-muted-foreground" />}
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="font-mono-tabular text-sm font-bold">{value}</span>
    </div>
  );
}