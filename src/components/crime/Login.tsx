import { useState, type FormEvent } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ADMIN_ID = "admin123";
const ADMIN_PW = "csa0802";
const STORAGE_KEY = "crimewatch_auth_v1";

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(STORAGE_KEY) === "ok";
}

export function signOut() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function Login({ onSuccess }: { onSuccess: () => void }) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (id.trim() === ADMIN_ID && pw === ADMIN_PW) {
      sessionStorage.setItem(STORAGE_KEY, "ok");
      setError("");
      onSuccess();
    } else {
      setError("Invalid ID or password");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-5 rounded-xl border border-border bg-card p-6 shadow-2xl"
      >
        <div className="flex items-center gap-2">
          <span
            className="pulse-dot-red inline-block h-2.5 w-2.5 rounded-full"
            style={{ background: "var(--severity-high)" }}
          />
          <Shield className="h-5 w-5" />
          <h1 className="text-lg font-bold tracking-tight">
            CrimeWatch Live <span className="font-normal text-muted-foreground">— Chennai</span>
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Restricted dispatch console. Sign in to view the live feed and map.
        </p>

        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">User ID</Label>
          <Input
            value={id}
            onChange={(e) => setId(e.target.value)}
            autoComplete="username"
            placeholder="admin123"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
          <Input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p
            className="rounded-md border px-3 py-2 text-xs"
            style={{
              borderColor: "var(--severity-high)",
              color: "var(--severity-high)",
              background: "color-mix(in oklab, var(--severity-high) 12%, transparent)",
            }}
          >
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full font-bold uppercase tracking-wider text-white"
          style={{ backgroundColor: "var(--severity-high)" }}
        >
          Sign In
        </Button>

        <p className="text-center text-[10px] text-muted-foreground">
          Demo credentials — id: <span className="font-mono-tabular">admin123</span> · pw:{" "}
          <span className="font-mono-tabular">csa0802</span>
        </p>
      </form>
    </div>
  );
}