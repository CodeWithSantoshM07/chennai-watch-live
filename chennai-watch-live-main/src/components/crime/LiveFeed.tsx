import { MapPin } from "lucide-react";
import type { Incident } from "@/lib/crime-data";
import { timeAgo } from "@/lib/crime-data";
import { SeverityBadge } from "./SeverityBadge";
import { ScrollArea } from "@/components/ui/scroll-area";

export function LiveFeed({ incidents, now }: { incidents: Incident[]; now: number }) {
  const visible = incidents.slice(0, 30);
  const borderColor = (s: Incident["severity"]) =>
    s === "High"
      ? "var(--severity-high)"
      : s === "Medium"
        ? "var(--severity-medium)"
        : "var(--severity-low)";
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-bold uppercase tracking-wider">Live Feed</h2>
        <span className="font-mono-tabular text-xs text-muted-foreground">
          {incidents.length} total
        </span>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-3">
          {visible.length === 0 && (
            <p className="px-2 py-8 text-center text-sm text-muted-foreground">
              No incidents yet.
            </p>
          )}
          {visible.map((i) => (
            <div
              key={i.id}
              className="fade-in-up rounded-md bg-card p-3 pl-3"
              style={{ borderLeft: `3px solid ${borderColor(i.severity)}` }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold">{i.type}</span>
                <SeverityBadge severity={i.severity} />
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{i.area}</span>
              </div>
              <p className="mt-1 text-xs text-foreground/80">{i.description}</p>
              <p className="font-mono-tabular mt-1 text-[10px] text-muted-foreground">
                {timeAgo(i.timestamp, now)}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}