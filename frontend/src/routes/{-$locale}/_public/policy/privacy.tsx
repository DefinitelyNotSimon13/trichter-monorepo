import { createFileRoute, Link } from "@tanstack/react-router";
import { clientEnv } from "#/env/client";

export const Route = createFileRoute("/{-$locale}/_public/policy/privacy")({
  head: ({ params }) => {
    const locale = params.locale;
    const title = "Privacy Policy | Trichter";
    const siteUrl = clientEnv.VITE_PUBLIC_URL;
    const pageUrl = locale
      ? `${siteUrl}/${locale}/policy/privacy`
      : `${siteUrl}/policy/privacy`;

    return {
      meta: [
        { title },
        { name: "robots", content: "noindex,follow" },
        { property: "og:title", content: title },
        { property: "og:url", content: pageUrl },
      ],
      links: [{ rel: "canonical", href: pageUrl }],
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-16 sm:px-6">
      <article className="rounded-2xl border bg-background p-8 shadow-sm sm:p-10">
        <header className="border-b pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Legal
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Privacy Policy
          </h1>

          <p className="mt-4 text-sm text-muted-foreground">
            Last updated: April 27, 2026
          </p>
        </header>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-headings:font-semibold prose-h2:mt-10 prose-h2:border-b prose-h2:pb-2 prose-h3:mt-8 prose-p:leading-7 prose-li:leading-7">
          <PrivacyPolicy />
        </div>
      </article>
    </main>
  );
}

function PrivacyPolicy() {
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold prose-h2:mt-10 prose-h2:border-b prose-h2:pb-2 prose-h3:mt-8 prose-p:leading-7 prose-li:leading-7">
      <p>
        This Privacy Notice for <strong>Trichter</strong> ("we", "us", or "our")
        describes how and why we might access, collect, store, use, and/or share
        ("process") your personal information when you use our services.
      </p>

      <ul>
        <li>
          Visit our website at{" "}
          <a href="https://trichter.hauptspeicher.com">
            https://trichter.hauptspeicher.com
          </a>
        </li>
        <li>Use our mobile application</li>
        <li>Use Trichter to experience drinking in a competitive way</li>
        <li>Engage with us via marketing or events</li>
      </ul>

      <p>
        Questions?{" "}
        <Link to="/{-$locale}/contact">Contact us via our contact form</Link>.
      </p>

      <h2>Summary of Key Points</h2>

      <ul>
        <li>
          <strong>Personal data:</strong> We collect information you provide
          (e.g. email, username).
        </li>
        <li>
          <strong>Sensitive data:</strong> We do not process sensitive personal
          data.
        </li>
        <li>
          <strong>Third-party data:</strong> We do not collect data from third
          parties.
        </li>
        <li>
          <strong>Processing:</strong> To operate, improve, and secure the
          service.
        </li>
        <li>
          <strong>Sharing:</strong> Only in limited cases (e.g. business
          transfers).
        </li>
        <li>
          <strong>Security:</strong> We use technical and organisational
          safeguards.
        </li>
        <li>
          <strong>Rights:</strong> You may have rights under GDPR depending on
          your location.
        </li>
      </ul>

      <h2>1. What Information Do We Collect?</h2>

      <h3>Personal Information</h3>
      <p>We collect personal information you provide to us, including:</p>

      <ul>
        <li>Names</li>
        <li>Email addresses</li>
        <li>Usernames</li>
        <li>Passwords</li>
      </ul>

      <p>We do not process sensitive personal information.</p>

      <h3>Social Login Data</h3>
      <p>
        If you log in via a social provider (e.g. Google, Facebook), we may
        receive profile information such as name and email.
      </p>

      <h3>Application Data</h3>
      <ul>
        <li>
          <strong>Location:</strong> Used for location-based features
        </li>
        <li>
          <strong>Device access:</strong> Bluetooth and other features
        </li>
        <li>
          <strong>Notifications:</strong> Push notifications
        </li>
      </ul>

      <h2>2. How Do We Process Your Information?</h2>

      <ul>
        <li>Account creation and authentication</li>
        <li>Service operation and improvement</li>
        <li>Communication (updates, changes)</li>
        <li>Security and fraud prevention</li>
      </ul>

      <h2>3. Legal Bases (GDPR)</h2>

      <ul>
        <li>
          <strong>Consent</strong>
        </li>
        <li>
          <strong>Contract performance</strong>
        </li>
        <li>
          <strong>Legal obligations</strong>
        </li>
        <li>
          <strong>Vital interests</strong>
        </li>
      </ul>

      <h2>4. Sharing Your Information</h2>

      <p>We may share data in limited situations such as:</p>

      <ul>
        <li>Business transfers (mergers, acquisitions)</li>
      </ul>

      <h2>5. Social Logins</h2>

      <p>
        When using social login providers, we receive limited profile data. We
        do not control how those providers use your data — review their
        policies.
      </p>

      <h2>6. Data Retention</h2>

      <p>
        We retain personal data only as long as necessary for the purposes
        described here, or as required by law.
      </p>

      <h2>7. Security</h2>

      <p>
        We use reasonable technical and organisational measures to protect your
        data. However, no system is 100% secure.
      </p>

      <h2>8. Minors</h2>

      <p>
        We do not knowingly collect data from users under 18. If discovered, we
        will delete it.
      </p>

      <h2>9. Your Rights</h2>

      <ul>
        <li>Access your data</li>
        <li>Request correction or deletion</li>
        <li>Restrict or object to processing</li>
        <li>Data portability</li>
      </ul>

      <p>
        <Link to="/{-$locale}/contact">Contact us</Link> to exercise your
        rights.
      </p>

      <h2>10. Do Not Track</h2>

      <p>
        We do not currently respond to Do-Not-Track signals due to lack of a
        standard.
      </p>

      <h2>11. Updates</h2>

      <p>
        We may update this policy. Changes will be posted here with an updated
        date.
      </p>

      <h2>12. Contact</h2>

      <p>
        Trichter
        <br />
        Werastraße 48
        <br />
        88045 Friedrichshafen
        <br />
        Germany
      </p>

      <p>
        <Link to="/{-$locale}/contact">Contact form</Link>
      </p>

      <h2>13. Your Data Requests</h2>

      <p>
        You can review, update, or delete your data at:
        <br />
        <a href="https://trichter.hauptspeicher.com/data-service">
          https://trichter.hauptspeicher.com/data-service
        </a>
      </p>
    </div>
  );
}
