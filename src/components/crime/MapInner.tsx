import { useEffect } from "react";
import { MapContainer, TileLayer, Circle, CircleMarker, Tooltip, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Incident } from "@/lib/crime-data";
import { AREAS, CHENNAI_CENTER } from "@/lib/crime-data";
import { SeverityBadge } from "./SeverityBadge";

export type FlyTarget = { lat: number; lon: number; zoom: number; key: number } | null;

const sevColor = (s: Incident["severity"]) =>
  s === "High" ? "#ef4444" : s === "Medium" ? "#f97316" : "#3b82f6";

function FlyController({ target }: { target: FlyTarget }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lon], target.zoom, { duration: 1.2 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.key]);
  return null;
}

export default function MapInner({
  incidents,
  flyTo,
}: {
  incidents: Incident[];
  flyTo: FlyTarget;
}) {
  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={CHENNAI_CENTER}
        zoom={12}
        scrollWheelZoom
        className="h-full w-full"
        style={{ background: "var(--background)" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap, &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {AREAS.map((a) => (
          <Circle
            key={a.name}
            center={[a.lat, a.lon]}
            radius={900}
            pathOptions={{ color: "#94a3b8", weight: 1, fillOpacity: 0.04 }}
          >
            <Tooltip
              direction="center"
              permanent
              className="!border-0 !bg-transparent !text-xs !text-slate-300 !shadow-none"
            >
              {a.name}
            </Tooltip>
          </Circle>
        ))}
        {incidents.map((i) => (
          <CircleMarker
            key={i.id}
            center={[i.lat, i.lon]}
            radius={7}
            pathOptions={{
              color: sevColor(i.severity),
              fillColor: sevColor(i.severity),
              fillOpacity: 0.85,
              weight: 2,
            }}
          >
            <Popup>
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <strong>{i.type}</strong>
                  <SeverityBadge severity={i.severity} />
                </div>
                <div className="text-xs opacity-80">📍 {i.area}</div>
                <div className="text-xs">{i.description}</div>
                <div className="font-mono-tabular text-[10px] opacity-70">
                  {new Date(i.timestamp).toLocaleString()}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
        <FlyController target={flyTo} />
      </MapContainer>
      <div className="pointer-events-none absolute bottom-3 right-3 z-[400] rounded-md border border-border bg-card/90 p-3 text-xs backdrop-blur">
        <div className="mb-1 font-semibold uppercase tracking-wider text-muted-foreground">
          Severity
        </div>
        <div className="mb-0.5 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--severity-high)" }} />
          High
        </div>
        <div className="mb-0.5 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--severity-medium)" }} />
          Medium
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--severity-low)" }} />
          Low
        </div>
      </div>
    </div>
  );
}