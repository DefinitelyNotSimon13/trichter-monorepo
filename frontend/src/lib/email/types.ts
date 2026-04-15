export type EmailAddress = {
	email: string;
	name?: string;
};

export type EmailMessage = {
	from: EmailAddress;
	to: EmailAddress[];
	subject: string;
	text?: string;
	html?: string;
	replyTo?: EmailAddress;
};

export interface EmailProvider {
	send(message: EmailMessage): Promise<{ id?: string }>;
}
