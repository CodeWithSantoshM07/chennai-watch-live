import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  AREAS,
  jitter,
  localId,
  makeAutoIncident,
  type CrimeType,
  type Incident,
  type Severity,
} from "@/lib/crime-data";
import { TopBar } from "@/components/crime/TopBar";
import { LiveFeed } from "@/components/crime/LiveFeed";
import { CrimeMap, type FlyTarget } from "@/components/crime/CrimeMap";
import { ReportForm } from "@/components/crime/ReportForm";
import { AreasPanel } from "@/components/crime/AreasPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Login, isAuthed, signOut } from "@/components/crime/Login";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "CrimeWatch Live — Chennai" },
      {
        name: "description",
        content:
          "Real-time crime tracking dashboard for Chennai. Live feed, interactive map, and citizen reporting.",
      },
    ],
  }),
});

const MAX_INCIDENTS = 120;

type DbRow = {
  id: string;
  type: string;
  severity: string;
  description: string;
  area: string;
  lat: number;
  lon: number;
  created_at: string;
};

function rowToIncident(r: DbRow): Incident {
  return {
    id: r.id,
    type: r.type as CrimeType,
    severity: r.severity as Severity,
    description: r.description,
    area: r.area,
    lat: r.lat,
    lon: r.lon,
    timestamp: new Date(r.created_at).getTime(),
    auto: false,
  };
}

function Dashboard() {
  const qc = useQueryClient();

  // Auth gate (client-only). Match SSR by starting false on both sides.
  const [authed, setAuthed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  useEffect(() => {
    setAuthed(isAuthed());
    setAuthChecked(true);
  }, []);

  // Seed incidents on the client only — avoids hydration mismatch from
  // Date.now() / Math.random().
  const [autoIncidents, setAutoIncidents] = useState<Incident[]>([]);
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    setAutoIncidents(
      Array.from({ length: 8 }, (_, i) => ({
        ...makeAutoIncident(i),
        id: localId(),
        timestamp: Date.now() - Math.floor(Math.random() * 60_000 * 8),
      })),
    );
  }, []);

  const [live, setLive] = useState(true);
  const [now, setNow] = useState(0);
  const [flyTo, setFlyTo] = useState<FlyTarget>(null);
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const tplIndex = useRef(0);

  // Clock ticks every second (client only)
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Auto-tick simulation
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => {
      if (Math.random() < 0.55) {
        setAutoIncidents((prev) => {
          const next: Incident = { ...makeAutoIncident(tplIndex.current++), id: localId() };
          return [next, ...prev].slice(0, MAX_INCIDENTS);
        });
      }
    }, 5000);
    return () => clearInterval(t);
  }, [live]);

  // Persistent incidents from DB
  const { data: dbIncidents = [] } = useQuery({
    queryKey: ["incidents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("incidents")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(MAX_INCIDENTS);
      if (error) throw error;
      return (data as DbRow[]).map(rowToIncident);
    },
    refetchInterval: 10_000,
    enabled: authed,
  });

  const submitMutation = useMutation({
    mutationFn: async (input: {
      type: CrimeType;
      severity: Severity;
      area: string;
      description: string;
    }) => {
      const area = AREAS.find((a) => a.name === input.area)!;
      const lat = jitter(area.lat);
      const lon = jitter(area.lon);
      const { data, error } = await supabase
        .from("incidents")
        .insert({
          type: input.type,
          severity: input.severity,
          area: input.area,
          description: input.description,
          lat,
          lon,
        })
        .select()
        .single();
      if (error) throw error;
      return rowToIncident(data as DbRow);
    },
    onSuccess: (incident) => {
      qc.setQueryData<Incident[]>(["incidents"], (prev) => {
        const list = prev ?? [];
        return [incident, ...list].slice(0, MAX_INCIDENTS);
      });
      toast.success("✓ Submitted — pinned on map");
    },
    onError: (e: Error) => toast.error(e.message || "Failed to submit"),
  });

  const incidents = useMemo<Incident[]>(() => {
    const merged = [...dbIncidents, ...autoIncidents].sort(
      (a, b) => b.timestamp - a.timestamp,
    );
    return merged.slice(0, MAX_INCIDENTS);
  }, [dbIncidents, autoIncidents]);

  const startOfToday = useMemo(() => {
    if (!now) return 0;
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, [now]);

  const todayCount = incidents.filter((i) => i.timestamp >= startOfToday).length;
  const activeCount = incidents.filter((i) => now - i.timestamp < 5 * 60_000).length;
  const clock = now ? new Date(now).toLocaleString() : "";

  if (!authChecked) {
    return <div className="min-h-screen bg-background" />;
  }
  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <TopBar
        live={live}
        onToggle={() => setLive((v) => !v)}
        todayCount={todayCount}
        activeCount={activeCount}
        clock={clock}
        onSignOut={() => {
          signOut();
          setAuthed(false);
        }}
      />

      <main
        className={
          mapFullscreen
            ? "flex-1 p-3"
            : "grid flex-1 grid-cols-1 gap-3 p-3 lg:grid-cols-[320px_minmax(0,1fr)_340px]"
        }
      >
        {!mapFullscreen && (
          <section className="rounded-lg border border-border bg-card lg:h-[calc(100vh-7.5rem)]">
            <LiveFeed incidents={incidents} now={now} />
          </section>
        )}

        <section
          className={
            mapFullscreen
              ? "relative overflow-hidden rounded-lg border border-border bg-card h-[calc(100vh-7.5rem)]"
              : "relative overflow-hidden rounded-lg border border-border bg-card lg:h-[calc(100vh-7.5rem)] min-h-[420px]"
          }
        >
          <CrimeMap incidents={incidents} flyTo={flyTo} />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setMapFullscreen((v) => !v)}
            className="absolute right-3 top-3 z-[450] gap-1.5 bg-card/90 backdrop-blur"
          >
            {mapFullscreen ? (
              <>
                <Minimize2 className="h-3.5 w-3.5" /> Exit
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5" /> Fullscreen
              </>
            )}
          </Button>
        </section>

        {!mapFullscreen && (
          <section className="rounded-lg border border-border bg-card lg:h-[calc(100vh-7.5rem)]">
            <Tabs defaultValue="report" className="flex h-full flex-col">
              <TabsList className="m-3 grid grid-cols-2">
                <TabsTrigger value="report">Report</TabsTrigger>
                <TabsTrigger value="areas">Areas</TabsTrigger>
              </TabsList>
              <TabsContent value="report" className="flex-1 overflow-y-auto">
                <ReportForm
                  onSubmit={async (input) => {
                    await submitMutation.mutateAsync(input);
                  }}
                />
              </TabsContent>
              <TabsContent value="areas" className="flex-1 overflow-hidden">
                <AreasPanel
                  incidents={incidents}
                  onSelect={(lat, lon) =>
                    setFlyTo({ lat, lon, zoom: 14, key: Date.now() })
                  }
                />
              </TabsContent>
            </Tabs>
          </section>
        )}
      </main>

      <footer className="flex items-center justify-between border-t border-border bg-background px-4 py-2 text-xs">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: "var(--live)" }}
          />
          Ready
        </span>
        <span className="font-mono-tabular text-muted-foreground">{clock}</span>
      </footer>
    </div>
  );
}
