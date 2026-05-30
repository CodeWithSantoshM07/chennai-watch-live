import { useEffect, useState, type ComponentType } from "react";
import type { Incident } from "@/lib/crime-data";
import type { FlyTarget } from "./MapInner";

export type { FlyTarget } from "./MapInner";

type Props = { incidents: Incident[]; flyTo: FlyTarget };

export function CrimeMap(props: Props) {
  const [Inner, setInner] = useState<ComponentType<Props> | null>(null);
  useEffect(() => {
    let cancelled = false;
    import("./MapInner").then((m) => {
      if (!cancelled) setInner(() => m.default);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  if (!Inner) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-card">
        <span className="text-sm text-muted-foreground">Loading map…</span>
      </div>
    );
  }
  return <Inner {...props} />;
}