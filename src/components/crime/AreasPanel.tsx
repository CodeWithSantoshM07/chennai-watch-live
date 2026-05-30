import type { Incident } from "@/lib/crime-data";
import { AREAS } from "@/lib/crime-data";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AreasPanel({
  incidents,
  onSelect,
}: {
  incidents: Incident[];
  onSelect: (lat: number, lon: number) => void;
}) {
  const counts = new Map<string, number>();
  for (const a of AREAS) counts.set(a.name, 0);
  for (const i of incidents) counts.set(i.area, (counts.get(i.area) || 0) + 1);
  const max = Math.max(1, ...Array.from(counts.values()));

  const colorFor = (n: number) =>
    n >= 5 ? "var(--severity-high)" : n >= 3 ? "var(--severity-medium)" : "var(--severity-low)";

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-3">
        {AREAS.map((a) => {
          const n = counts.get(a.name) || 0;
          const pct = (n / max) * 100;
          return (
            <button
              key={a.name}
              onClick={() => onSelect(a.lat, a.lon)}
              className="group w-full rounded-md p-2 text-left transition hover:bg-accent"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{a.name}</span>
                <span className="font-mono-tabular text-xs text-muted-foreground">{n}</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: colorFor(n) }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}