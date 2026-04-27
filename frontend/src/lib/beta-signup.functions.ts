import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { z } from "zod";
import { auth } from "#/lib/auth";
import { sendEmail } from "#/lib/email/index.server";
import { betaAcceptanceEmailHtml } from "#/lib/email/templates";

// TODO: replace with the real Play Store URL once the app is public
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=org.trichter.app";

const emailSchema = z.object({ email: z.string().email() });

export const registerForBeta = createServerFn({ method: "POST" })
  .inputValidator(emailSchema)
  .handler(async ({ data }) => {
    await sendEmail({
      to: "simon21.blum@gmail.com",
      subject: `Trichter Beta Signup: ${data.email}`,
      text: `New beta signup request\n\nGoogle Play email: ${data.email}`,
    });
    return { ok: true as const };
  });

export const sendBetaAcceptance = createServerFn({ method: "POST" })
  .inputValidator(emailSchema)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    if (!session) {
      return { ok: false as const, reason: "unauthenticated" as const };
    }

    const role = session.user?.role;
    const isAdmin = Array.isArray(role)
      ? role.includes("admin")
      : role === "admin";

    if (!isAdmin) {
      return { ok: false as const, reason: "forbidden" as const };
    }

    await sendEmail({
      to: data.email,
      subject: "You're in! Welcome to the Trichter Beta",
      html: betaAcceptanceEmailHtml(PLAY_STORE_URL),
      text: `You've been accepted into the Trichter closed beta on Android!\n\nDownload the app here: ${PLAY_STORE_URL}`,
    });

    return { ok: true as const };
  });
