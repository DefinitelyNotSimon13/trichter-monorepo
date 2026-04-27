import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";
import { clientEnv } from "#/env/client";
import { sendContactMessage } from "#/lib/contact.functions";

export const Route = createFileRoute("/{-$locale}/_public/contact")({
  head: ({ params }) => {
    const locale = params.locale;
    const title = "Contact | Trichter";
    const description = "Get in touch with the Trichter team.";
    const siteUrl = clientEnv.VITE_PUBLIC_URL;
    const pageUrl = locale
      ? `${siteUrl}/${locale}/contact`
      : `${siteUrl}/contact`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: pageUrl },
      ],
      links: [{ rel: "canonical", href: pageUrl }],
    };
  },
  component: ContactPage,
});

type FormState = "idle" | "loading" | "success" | "error";

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<FormState>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    try {
      await sendContactMessage({ data: { name, email, message } });
      setState("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setState("error");
    }
  };

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-16 sm:px-6">
      <section className="rounded-2xl border p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Contact
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Get in touch.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
          Questions, feedback, or just want to say hi? Drop us a message and
          we'll get back to you.
        </p>

        {state === "success" ? (
          <p className="mt-10 font-semibold text-primary">
            Message sent, we'll get back to you shortly.
          </p>
        ) : (
          <form
            onSubmit={(e) => void handleSubmit(e)}
            className="mt-10 flex max-w-lg flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                required
                minLength={1}
                maxLength={100}
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={state === "loading"}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={state === "loading"}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                required
                minLength={10}
                maxLength={2000}
                placeholder="What's on your mind?"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={state === "loading"}
                className="resize-none"
              />
            </div>

            {state === "error" && (
              <p className="text-sm text-destructive">
                Something went wrong. Please try again.
              </p>
            )}

            <Button
              type="submit"
              disabled={state === "loading"}
              className="self-start"
            >
              {state === "loading" ? "Sending…" : "Send message"}
            </Button>
          </form>
        )}
      </section>
    </main>
  );
}
