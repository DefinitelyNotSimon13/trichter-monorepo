import { apiKey } from "@better-auth/api-key";
import { i18n } from "@better-auth/i18n";
import { dash } from "@better-auth/infra";
import { oauthProvider } from "@better-auth/oauth-provider";
import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import {
  admin,
  captcha,
  emailOTP,
  jwt,
  lastLoginMethod,
  magicLink,
  openAPI,
  username,
} from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { Pool } from "pg";
import { clientEnv } from "#/env/client";
import { serverEnv } from "#/env/server";
import { sendEmail } from "./email/index.server";
import {
  deleteAccountEmailHtml,
  magicLinkEmailHtml,
  otpEmailHtml,
  passwordResetEmailHtml,
  verificationEmailHtml,
} from "./email/templates";

export const auth = betterAuth({
  appName: "Trichter",
  database: new Pool({
    connectionString: serverEnv.DATABASE_URL,
  }),
  user: {
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        void sendEmail({
          to: user.email,
          subject: "Confirm account deletion",
          text: `Click the link to confirm deleting your Trichter account: ${url}`,
          html: deleteAccountEmailHtml(url),
        });
      },
    },
  },
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
    onExistingUserSignUp: async ({ user }, request) => {
      //TODO: Notify user about it?
      console.log(`Someone tried to sign up with ${user.email}`);
      console.debug(request);
    },
  },
  socialProviders: {
    google: {
      clientId: clientEnv.VITE_GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const userData = user;

          if (!user.username) {
            let generatedUsername = userData.name
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "_")
              .replace(/-+/g, "_")
              .replace(/^-|-$/g, "");

            if (!generatedUsername) {
              generatedUsername = "user";
            }

            const timestamp = Date.now().toString().slice(-4);
            const finalUsername = `${generatedUsername}_${timestamp}`;

            return {
              data: {
                ...user,
                username: finalUsername,
                displayUsername: user.name,
              },
            };
          } else if (user.username && !user.displayUsername) {
            return {
              data: {
                ...user,
                displayUsername: userData.username,
              },
            };
          }

          return;
        },
      },
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
    emailOTP({
      storeOTP: "hashed",
      async sendVerificationOTP({ email, otp, type }) {
        void sendEmail({
          to: email,
          subject:
            type === "sign-in"
              ? "Your Trichter login code"
              : "Verify your email",
          text: `Your code is: ${otp}`,
          html: otpEmailHtml(otp, type),
        });
      },
      expiresIn: 600,
    }),
    magicLink({
      storeToken: "hashed",
      async sendMagicLink({ email, url }) {
        void sendEmail({
          to: email,
          subject: "Sign in to Trichter",
          text: `Click to sign in: ${url}`,
          html: magicLinkEmailHtml(url),
        });
      },
      expiresIn: 600,
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
        "/sign-up/username",
        "/request-password-reset",
        "/email-otp/send-verification-otp",
        "/sign-in/magic-link",
      ],
    }),
    oauthProvider({
      loginPage: "/oauth/login",
      signup: {
        page: "/signup",
      },
      consentPage: "/consent",
      silenceWarnings: {
        oauthAuthServerConfig: true,
      },
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
