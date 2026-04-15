import { serverEnv } from "#/env/server";
import { AcsEmailProvider } from "./providers/acs.server";

const provider = new AcsEmailProvider({
  connectionString: serverEnv.ACS_CONNECTION_STRING,
  from: serverEnv.EMAIL_FROM,
});

export type SendEmailArgs = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export async function sendEmail(args: SendEmailArgs) {
  return provider.send(args);
}
