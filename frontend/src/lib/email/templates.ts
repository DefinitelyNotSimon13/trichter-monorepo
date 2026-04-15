/**
 * Simple branded HTML email templates for Trichter.
 * Uses inline CSS for maximum email client compatibility.
 */

const APP_NAME = "Trichter";
const BRAND_COLOR = "#0f172a"; // slate-900 – matches the app's primary
const BUTTON_COLOR = "#6366f1"; // indigo-500 – primary action colour

function emailBase(content: string): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${APP_NAME}</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:24px;text-align:center;">
              <span style="font-size:22px;font-weight:900;letter-spacing:-0.03em;color:${BRAND_COLOR};">${APP_NAME}</span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#ffffff;border-radius:16px;border:1px solid #e2e8f0;padding:40px 36px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;text-align:center;font-size:12px;color:#94a3b8;">
              © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
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
	return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto 0;">
    <tr>
      <td align="center" style="border-radius:8px;background-color:${BUTTON_COLOR};">
        <a href="${url}" target="_blank"
           style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;letter-spacing:0.01em;">
          ${label}
        </a>
      </td>
    </tr>
  </table>`;
}

function fallbackLink(url: string): string {
	return `<p style="margin:20px 0 0;font-size:12px;color:#94a3b8;word-break:break-all;">
    Or copy this link: <a href="${url}" style="color:#6366f1;">${url}</a>
  </p>`;
}

export function verificationEmailHtml(url: string): string {
	const content = `
    <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:${BRAND_COLOR};letter-spacing:-0.02em;">
      Verify your email
    </h1>
    <p style="margin:0 0 0;font-size:15px;line-height:1.6;color:#475569;">
      Thanks for signing up for ${APP_NAME}! Please verify your email address to activate your account.
    </p>
    ${ctaButton("Verify email address", url)}
    ${fallbackLink(url)}
    <p style="margin:28px 0 0;font-size:12px;color:#94a3b8;">
      If you didn't create an account with ${APP_NAME}, you can safely ignore this email.
    </p>`;

	return emailBase(content);
}

export function passwordResetEmailHtml(url: string): string {
	const content = `
    <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:${BRAND_COLOR};letter-spacing:-0.02em;">
      Reset your password
    </h1>
    <p style="margin:0 0 0;font-size:15px;line-height:1.6;color:#475569;">
      We received a request to reset the password for your ${APP_NAME} account.
      Click the button below to choose a new password. This link expires in 1 hour.
    </p>
    ${ctaButton("Reset password", url)}
    ${fallbackLink(url)}
    <p style="margin:28px 0 0;font-size:12px;color:#94a3b8;">
      If you didn't request a password reset, you can safely ignore this email.
      Your password will not be changed.
    </p>`;

	return emailBase(content);
}
