import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { serverEnv } from "#/env/server";
import { sendEmail } from "#/lib/email/index.server";

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
});

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator(contactSchema)
  .handler(async ({ data }) => {
    await sendEmail({
      to: serverEnv.EMAIL_CONTACT,
      subject: `Trichter Contact: ${data.name}`,
      text: `From: ${data.name} <${data.email}>\n\n${data.message}`,
    });
    return { ok: true as const };
  });
