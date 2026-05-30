import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CRIME_TYPES, SEVERITIES, AREAS, type CrimeType, type Severity } from "@/lib/crime-data";

export function ReportForm({
  onSubmit,
}: {
  onSubmit: (input: { type: CrimeType; severity: Severity; area: string; description: string }) => Promise<void> | void;
}) {
  const [type, setType] = useState<CrimeType>("Theft");
  const [area, setArea] = useState<string>(AREAS[0].name);
  const [severity, setSeverity] = useState<Severity>("Medium");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handle() {
    setSubmitting(true);
    try {
      await onSubmit({ type, severity, area, description: description.trim() || `${type} reported` });
      setDescription("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-3 p-4">
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Crime Type</Label>
        <Select value={type} onValueChange={(v) => setType(v as CrimeType)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {CRIME_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Area</Label>
        <Select value={area} onValueChange={setArea}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {AREAS.map((a) => <SelectItem key={a.name} value={a.name}>{a.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Severity</Label>
        <Select value={severity} onValueChange={(v) => setSeverity(v as Severity)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {SEVERITIES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Description</Label>
        <Textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What happened?"
        />
      </div>
      <Button
        onClick={handle}
        disabled={submitting}
        className="w-full font-bold uppercase tracking-wider text-white"
        style={{ backgroundColor: "var(--severity-high)" }}
      >
        {submitting ? "Submitting…" : "Submit & Pin on Map"}
      </Button>
    </div>
  );
}