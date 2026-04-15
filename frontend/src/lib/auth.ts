import { apiKey } from "@better-auth/api-key";
import { i18n } from "@better-auth/i18n";
import { dash } from "@better-auth/infra";
import { oauthProvider } from "@better-auth/oauth-provider";
import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import {
	admin,
	captcha,
	jwt,
	lastLoginMethod,
	openAPI,
	username,
} from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { Pool } from "pg";
import { clientEnv } from "#/env/client";
import { serverEnv } from "#/env/server";
import { sendEmail } from "./email/index.server";
import {
	passwordResetEmailHtml,
	verificationEmailHtml,
} from "./email/templates";

export const auth = betterAuth({
	appName: "Trichter",
	database: new Pool({
		connectionString: serverEnv.DATABASE_URL,
	}),
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			void sendEmail({
				to: user.email,
				subject: "Verify your email address",
				text: `Click the link to verify your email: ${url}`,
				html: verificationEmailHtml(url),
			});
		},
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			void sendEmail({
				to: user.email,
				subject: "Reset your password",
				text: `Click the link to reset your password: ${url}`,
				html: passwordResetEmailHtml(url),
			});
		},
	},
	socialProviders: {
		google: {
			clientId: clientEnv.VITE_GOOGLE_CLIENT_ID,
			clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
		},
	},
	advanced: {
		ipAddress: {
			ipAddressHeaders: ["cf-connecting-ip", "x-forwarded-for"],
		},
	},
	experimental: {
		joins: true,
	},
	plugins: [
		dash({
			apiKey: serverEnv.BETTER_AUTH_API_KEY,
			activityTracking: {
				enabled: true,
				updateInterval: 300000,
			},
		}),
		passkey(),
		username(),
		lastLoginMethod(),
		jwt(),
		apiKey(),
		openAPI(),
		admin(),
		captcha({
			provider: "cloudflare-turnstile",
			secretKey: serverEnv.TURNSTYLE_SECRET_KEY,
			endpoints: [
				"/sign-up/email",
				"/sign-in/email",
				"/sign-up/username",
				"/sign-in/username",
				"/request-password-reset",
			],
		}),
		oauthProvider({
			loginPage: "/login",
			consentPage: "/consent",
		}),
		i18n({
			translations: {
				de: {
					USER_NOT_FOUND: "Benutzer:in nicht gefunde",
				},
			},
		}),
		tanstackStartCookies(),
	],
});
