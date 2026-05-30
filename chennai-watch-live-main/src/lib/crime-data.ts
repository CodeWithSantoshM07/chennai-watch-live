export type Severity = "Low" | "Medium" | "High";
export type CrimeType =
  | "Theft"
  | "Assault"
  | "Robbery"
  | "Burglary"
  | "Vandalism"
  | "Fraud"
  | "Drug Offense"
  | "Cybercrime";

export type Incident = {
  id: string;
  type: CrimeType;
  severity: Severity;
  description: string;
  area: string;
  lat: number;
  lon: number;
  timestamp: number;
  auto?: boolean;
};

export const AREAS = [
  { name: "Anna Nagar", lat: 13.085, lon: 80.2101 },
  { name: "T. Nagar", lat: 13.0418, lon: 80.2341 },
  { name: "Velachery", lat: 12.9791, lon: 80.2209 },
  { name: "Adyar", lat: 13.0067, lon: 80.2574 },
  { name: "Egmore", lat: 13.0732, lon: 80.2609 },
  { name: "Kodambakkam", lat: 13.049, lon: 80.2222 },
  { name: "Perambur", lat: 13.1142, lon: 80.2344 },
  { name: "Tambaram", lat: 12.9249, lon: 80.1 },
  { name: "Chrompet", lat: 12.9516, lon: 80.1462 },
  { name: "Mylapore", lat: 13.0339, lon: 80.2676 },
  { name: "Guindy", lat: 13.0068, lon: 80.2206 },
  { name: "Porur", lat: 13.0374, lon: 80.1568 },
  { name: "Ambattur", lat: 13.1143, lon: 80.1548 },
  { name: "Sholinganallur", lat: 12.901, lon: 80.2279 },
  { name: "Avadi", lat: 13.1149, lon: 80.1022 },
] as const;

export const CRIME_TYPES: CrimeType[] = [
  "Theft",
  "Assault",
  "Robbery",
  "Burglary",
  "Vandalism",
  "Fraud",
  "Drug Offense",
  "Cybercrime",
];

export const SEVERITIES: Severity[] = ["Low", "Medium", "High"];

export const AUTO_TEMPLATES: { type: CrimeType; severity: Severity; desc: string }[] = [
  { type: "Theft", severity: "Medium", desc: "Bag snatching near bus stop" },
  { type: "Assault", severity: "High", desc: "Physical altercation reported" },
  { type: "Vandalism", severity: "Low", desc: "Property damage on main road" },
  { type: "Robbery", severity: "High", desc: "Armed robbery near ATM" },
  { type: "Burglary", severity: "Medium", desc: "Break-in at residential area" },
  { type: "Drug Offense", severity: "Medium", desc: "Suspicious activity near park" },
  { type: "Fraud", severity: "Low", desc: "Online fraud complaint filed" },
  { type: "Theft", severity: "Low", desc: "Mobile snatched at signal" },
  { type: "Assault", severity: "Medium", desc: "Dispute escalated near market" },
  { type: "Cybercrime", severity: "Low", desc: "Phishing attempt reported" },
  { type: "Robbery", severity: "Medium", desc: "Chain snatching on main road" },
  { type: "Burglary", severity: "High", desc: "Shop broken into overnight" },
];

export const CHENNAI_CENTER: [number, number] = [13.0827, 80.2707];

export function jitter(v: number) {
  return v + (Math.random() * 2 - 1) * 0.007;
}

export function severityColor(s: Severity): string {
  switch (s) {
    case "High":
      return "var(--severity-high)";
    case "Medium":
      return "var(--severity-medium)";
    default:
      return "var(--severity-low)";
  }
}

export function severityClass(s: Severity): string {
  switch (s) {
    case "High":
      return "severity-high";
    case "Medium":
      return "severity-medium";
    default:
      return "severity-low";
  }
}

export function timeAgo(ts: number, now: number): string {
  const diff = Math.max(0, Math.floor((now - ts) / 1000));
  if (diff < 60) return `${diff}s ago`;
  const m = Math.floor(diff / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export function makeAutoIncident(index: number): Omit<Incident, "id"> {
  const tpl = AUTO_TEMPLATES[index % AUTO_TEMPLATES.length];
  const area = AREAS[Math.floor(Math.random() * AREAS.length)];
  return {
    type: tpl.type,
    severity: tpl.severity,
    description: tpl.desc,
    area: area.name,
    lat: jitter(area.lat),
    lon: jitter(area.lon),
    timestamp: Date.now(),
    auto: true,
  };
}

let _id = 1;
export function localId(): string {
  return `local-${Date.now()}-${_id++}`;
}