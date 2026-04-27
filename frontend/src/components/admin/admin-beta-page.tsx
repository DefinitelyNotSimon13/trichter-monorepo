import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { sendBetaAcceptance } from "#/lib/beta-signup.functions";

type SendState = "idle" | "loading" | "success" | "error";

export function AdminBetaPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SendState>("idle");
  const [lastSent, setLastSent] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    try {
      const result = await sendBetaAcceptance({ data: { email } });
      if (result.ok) {
        setLastSent(email);
        setEmail("");
        setState("success");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-lg">
      <h2 className="text-xl font-bold mb-1">Accept Android Tester</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Enter the Google Play account email of the person you want to accept.
        They'll receive an invitation email with a link to download the app.
      </p>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="beta-email">Google Play email</Label>
          <Input
            id="beta-email"
            type="email"
            required
            placeholder="tester@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={state === "loading"}
          />
        </div>

        <Button type="submit" disabled={state === "loading"}>
          {state === "loading" ? "Sending…" : "Send acceptance email"}
        </Button>
      </form>

      {state === "success" && lastSent && (
        <p className="mt-4 text-sm text-primary font-medium">
          Acceptance email sent to {lastSent}.
        </p>
      )}
      {state === "error" && (
        <p className="mt-4 text-sm text-destructive">
          Failed to send. Check the server logs.
        </p>
      )}
    </div>
  );
}
