import { EmailClient } from "@azure/communication-email";

export type SendEmailInput = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export class AcsEmailProvider {
  private client: EmailClient;
  private from: string;

  constructor(options: { connectionString: string; from: string }) {
    this.client = new EmailClient(options.connectionString);
    this.from = options.from;
  }

  async send(input: SendEmailInput): Promise<{ id?: string }> {
    if (!input.text && !input.html) {
      throw new Error("Email must contain text or html");
    }

    const content = input.text
      ? {
          subject: input.subject,
          plainText: input.text,
          ...(input.html ? { html: input.html } : {}),
        }
      : {
          subject: input.subject,
          html: input.html ?? "",
        };

    const poller = await this.client.beginSend({
      senderAddress: this.from,
      content,
      recipients: {
        to: [{ address: input.to }],
      },
    });

    const result = await poller.pollUntilDone();

    return {
      id: typeof result?.id === "string" ? result.id : undefined,
    };
  }
}
