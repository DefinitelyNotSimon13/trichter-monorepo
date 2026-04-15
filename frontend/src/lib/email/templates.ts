const APP_NAME = "Trichter";

const COLORS = {
  bg: "#f8f7f2",
  panel: "#ffffff",
  text: "#181c14",
  muted: "#667066",
  border: "#e6e3d8",
  primary: "#58c414",
  primaryText: "#0f160c",
  highlight: "#f2ab2b",
  link: "#58c414",
};

const DARK = {
  bg: "#091018",
  panel: "#101720",
  text: "#f3f5ee",
  muted: "#8c948f",
  border: "rgba(255,255,255,0.10)",
  primary: "#6adb2a",
  primaryText: "#081106",
  highlight: "#f2ab2b",
  link: "#6adb2a",
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function emailBase(params: {
  preheader: string;
  eyebrow?: string;
  title: string;
  intro: string;
  body: string;
}): string {
  const { preheader, eyebrow = APP_NAME, title, intro, body } = params;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${escapeHtml(APP_NAME)}</title>
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }

    @media (prefers-color-scheme: dark) {
      body, .email-bg {
        background: ${DARK.bg} !important;
      }

      .email-panel {
        background: ${DARK.panel} !important;
        border-color: ${DARK.border} !important;
      }

      .email-text {
        color: ${DARK.text} !important;
      }

      .email-muted {
        color: ${DARK.muted} !important;
      }

      .email-link {
        color: ${DARK.link} !important;
      }

      .email-button {
        background: ${DARK.primary} !important;
        color: ${DARK.primaryText} !important;
      }

      .email-rule {
        border-color: ${DARK.border} !important;
      }

      .email-accent {
        color: ${DARK.highlight} !important;
      }
    }
  </style>
</head>
<body class="email-bg" style="margin:0;padding:0;background:${COLORS.bg};font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${COLORS.text};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;visibility:hidden;">
    ${escapeHtml(preheader)}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="email-bg" style="width:100%;border-collapse:collapse;background:${COLORS.bg};">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;border-collapse:collapse;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 20px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                <tr>
                  <td align="left" style="font-size:14px;line-height:1.2;font-weight:800;color:${COLORS.text};letter-spacing:-0.02em;">
                    <span class="email-text" style="color:${COLORS.text};font-weight:800;">${escapeHtml(APP_NAME)}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Panel -->
          <tr>
            <td class="email-panel" style="background:${COLORS.panel};border:1px solid ${COLORS.border};padding:36px 32px;">
              <p class="email-muted" style="margin:0 0 12px 0;font-size:12px;line-height:1.4;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${COLORS.muted};">
                ${escapeHtml(eyebrow)}
              </p>

              <h1 class="email-text" style="margin:0 0 14px 0;font-size:32px;line-height:0.98;font-weight:900;letter-spacing:-0.05em;color:${COLORS.text};">
                ${escapeHtml(title)}
              </h1>

              <p class="email-text" style="margin:0 0 10px 0;font-size:16px;line-height:1.7;color:${COLORS.text};">
                ${intro}
              </p>

              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:18px 4px 0 4px;">
              <p class="email-muted" style="margin:0;font-size:12px;line-height:1.6;color:${COLORS.muted};text-align:center;">
                © ${new Date().getFullYear()} ${escapeHtml(APP_NAME)}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(label: string, url: string): string {
  const safeLabel = escapeHtml(label);
  const safeUrl = escapeHtml(url);

  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0 0;border-collapse:collapse;">
    <tr>
      <td align="center" bgcolor="${COLORS.primary}" style="background:${COLORS.primary};">
        <a
          href="${safeUrl}"
          target="_blank"
          class="email-button"
          style="display:inline-block;padding:14px 22px;font-size:16px;line-height:1.2;font-weight:800;letter-spacing:-0.01em;text-decoration:none;background:${COLORS.primary};color:${COLORS.primaryText};"
        >
          ${safeLabel}
        </a>
      </td>
    </tr>
  </table>`;
}

function fallbackLink(url: string): string {
  const safeUrl = escapeHtml(url);

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;border-collapse:collapse;">
    <tr>
      <td class="email-rule" style="border-top:1px solid ${COLORS.border};padding-top:18px;">
        <p class="email-muted" style="margin:0 0 8px 0;font-size:12px;line-height:1.6;color:${COLORS.muted};">
          Button not working? Copy and paste this link into your browser:
        </p>
        <p style="margin:0;font-size:13px;line-height:1.7;word-break:break-all;">
          <a
            href="${safeUrl}"
            target="_blank"
            class="email-link"
            style="color:${COLORS.link};text-decoration:underline;"
          >${safeUrl}</a>
        </p>
      </td>
    </tr>
  </table>`;
}

function finePrint(text: string): string {
  return `
  <p class="email-muted" style="margin:22px 0 0 0;font-size:13px;line-height:1.7;color:${COLORS.muted};">
    ${text}
  </p>`;
}

function accentNote(label: string, value: string): string {
  return `
  <p style="margin:18px 0 0 0;font-size:13px;line-height:1.6;">
    <span class="email-muted" style="color:${COLORS.muted};">${escapeHtml(label)} </span>
    <span class="email-accent" style="color:${COLORS.highlight};font-weight:700;">${escapeHtml(value)}</span>
  </p>`;
}

export function otpEmailHtml(
  otp: string,
  type: "sign-in" | "email-verification" | "change-email" | "forget-password",
): string {
  const isSignIn = type === "sign-in";
  return emailBase({
    preheader: isSignIn
      ? `Your Trichter login code is ${otp}. Expires in 10 minutes.`
      : `Your Trichter verification code is ${otp}. Expires in 10 minutes.`,
    eyebrow: isSignIn ? "Sign in" : "Email verification",
    title: isSignIn ? "Your login code" : "Your verification code",
    intro: isSignIn
      ? `Use the code below to sign in to your <strong>${escapeHtml(APP_NAME)}</strong> account.`
      : `Use the code below to verify your <strong>${escapeHtml(APP_NAME)}</strong> email address.`,
    body: `
      <div style="margin:28px 0 0 0;text-align:center;">
        <div style="display:inline-block;padding:18px 32px;background:${COLORS.bg};border:2px solid ${COLORS.border};letter-spacing:0.3em;font-size:32px;font-weight:900;font-family:monospace;">
          <span class="email-text" style="color:${COLORS.text};">${escapeHtml(otp)}</span>
        </div>
      </div>
      ${accentNote("Expires in:", "10 minutes")}
      ${finePrint(`If you did not request this code, you can safely ignore this email.`)}
    `,
  });
}

export function magicLinkEmailHtml(url: string): string {
  return emailBase({
    preheader:
      "Click to sign in to your Trichter account. This link expires in 10 minutes.",
    eyebrow: "Sign in",
    title: "Sign in to Trichter",
    intro: `Click the button below to sign in to your <strong>${escapeHtml(APP_NAME)}</strong> account. No password needed.`,
    body: `
      ${ctaButton("Sign in", url)}
      ${accentNote("Link expiry:", "10 minutes")}
      ${fallbackLink(url)}
      ${finePrint(`If you did not request this link, you can safely ignore this email.`)}
    `,
  });
}

export function verificationEmailHtml(url: string): string {
  return emailBase({
    preheader: "Verify your email address to activate your Trichter account.",
    eyebrow: "Account setup",
    title: "Verify your email",
    intro: `
      Thanks for signing up for <strong>${escapeHtml(APP_NAME)}</strong>.
      Confirm your email address to activate your account and get into the app.
    `,
    body: `
      ${ctaButton("Verify email", url)}
      ${accentNote("Next step:", "one click and you're in")}
      ${fallbackLink(url)}
      ${finePrint(`If you did not create a ${escapeHtml(APP_NAME)} account, you can safely ignore this email.`)}
    `,
  });
}

export function passwordResetEmailHtml(url: string): string {
  return emailBase({
    preheader: "Reset your Trichter password. This link expires in 1 hour.",
    eyebrow: "Security",
    title: "Reset your password",
    intro: `
      We received a request to reset the password for your <strong>${escapeHtml(APP_NAME)}</strong> account.
      Use the button below to choose a new password.
    `,
    body: `
      ${ctaButton("Reset password", url)}
      ${accentNote("Link expiry:", "1 hour")}
      ${fallbackLink(url)}
      ${finePrint(`If you did not request a password reset, you can ignore this email. Your password will remain unchanged.`)}
    `,
  });
}
