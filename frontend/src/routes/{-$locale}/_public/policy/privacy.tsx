import { createFileRoute } from "@tanstack/react-router";
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
          <p>
            This Privacy Policy describes Our policies and procedures on the
            collection, use and disclosure of Your information when You use the
            Service and tells You about Your privacy rights and how the law
            protects You.
          </p>

          <p>
            We use Your Personal Data to provide and improve the Service. By
            using the Service, You agree to the collection and use of
            information in accordance with this Privacy Policy.
          </p>

          <h2>Interpretation and Definitions</h2>

          <h3>Interpretation</h3>
          <p>
            The words whose initial letters are capitalized have meanings
            defined under the following conditions. The following definitions
            shall have the same meaning regardless of whether they appear in
            singular or in plural.
          </p>

          <h3>Definitions</h3>
          <p>For the purposes of this Privacy Policy:</p>

          <dl className="not-prose mt-6 space-y-4">
            {[
              [
                "Account",
                "A unique account created for You to access our Service or parts of our Service.",
              ],
              [
                "Company",
                'Trichter, referred to as either "the Company", "We", "Us" or "Our".',
              ],
              ["Country", "Baden-Württemberg, Germany."],
              [
                "Device",
                "Any device that can access the Service, such as a computer, cell phone or tablet.",
              ],
              [
                "Personal Data",
                "Any information that relates to an identified or identifiable individual.",
              ],
              ["Service", "The Website."],
              [
                "Website",
                "Trichter, accessible from https://trichter.hauptspeicher.com.",
              ],
              ["You", "The individual accessing or using the Service."],
            ].map(([term, description]) => (
              <div key={term} className="rounded-lg border p-4">
                <dt className="font-medium">{term}</dt>
                <dd className="mt-1 text-sm leading-6 text-muted-foreground">
                  {description}
                </dd>
              </div>
            ))}
          </dl>

          <h2>Collecting and Using Your Personal Data</h2>

          <h3>Types of Data Collected</h3>

          <h4>Personal Data</h4>
          <p>
            While using Our Service, We may ask You to provide Us with certain
            personally identifiable information that can be used to contact or
            identify You.
          </p>

          <ul>
            <li>Email address</li>
            <li>Usage Data</li>
          </ul>

          <h4>Usage Data</h4>
          <p>
            Usage Data is collected automatically when using the Service. Usage
            Data may include information such as Your Device&apos;s IP address,
            browser type, browser version, pages visited, time and date of Your
            visit, time spent on those pages, unique device identifiers and
            other diagnostic data.
          </p>

          <h3>Tracking Technologies and Cookies</h3>
          <p>
            We use Cookies and similar tracking technologies to track activity
            on Our Service and store certain information.
          </p>

          <ul>
            <li>
              <strong>Cookies or Browser Cookies.</strong> A cookie is a small
              file placed on Your Device.
            </li>
            <li>
              <strong>Web Beacons.</strong> Small electronic files that permit
              the Company to count users or gather related website statistics.
            </li>
          </ul>

          <h4>Necessary / Essential Cookies</h4>
          <p>
            These Cookies are essential to provide You with services available
            through the Website and to enable You to use some of its features.
          </p>

          <h4>Cookies Policy / Notice Acceptance Cookies</h4>
          <p>
            These Cookies identify if users have accepted the use of cookies on
            the Website.
          </p>

          <h4>Functionality Cookies</h4>
          <p>
            These Cookies allow Us to remember choices You make when You use the
            Website, such as login details or language preference.
          </p>

          <h2>Use of Your Personal Data</h2>
          <p>The Company may use Personal Data for the following purposes:</p>

          <ul>
            <li>To provide and maintain our Service.</li>
            <li>To manage Your Account.</li>
            <li>For the performance of a contract.</li>
            <li>To contact You.</li>
            <li>To manage Your requests.</li>
            <li>For business transfers.</li>
            <li>For analytics, improvements and other legitimate purposes.</li>
          </ul>

          <h2>Sharing Your Personal Data</h2>
          <p>We may share Your Personal Data in the following situations:</p>

          <ul>
            <li>With Service Providers.</li>
            <li>For business transfers.</li>
            <li>With Affiliates.</li>
            <li>With business partners.</li>
            <li>With other users in public areas of the Service.</li>
            <li>With Your consent.</li>
          </ul>

          <h2>Retention of Your Personal Data</h2>
          <p>
            The Company will retain Your Personal Data only for as long as is
            necessary for the purposes set out in this Privacy Policy.
          </p>

          <div className="not-prose mt-6 overflow-hidden rounded-xl border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Data category</th>
                  <th className="px-4 py-3 font-medium">Retention period</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3">User accounts</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Account duration plus up to 24 months
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Support correspondence</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Up to 24 months after ticket closure
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Website analytics</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Up to 24 months from collection
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Server logs</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Up to 24 months
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Transfer of Your Personal Data</h2>
          <p>
            Your information, including Personal Data, may be processed at the
            Company&apos;s operating offices and in other places where the
            parties involved in processing are located.
          </p>

          <h2>Delete Your Personal Data</h2>
          <p>
            You have the right to delete or request that We assist in deleting
            the Personal Data that We have collected about You.
          </p>

          <h2>Disclosure of Your Personal Data</h2>

          <h3>Business Transactions</h3>
          <p>
            If the Company is involved in a merger, acquisition or asset sale,
            Your Personal Data may be transferred.
          </p>

          <h3>Law Enforcement</h3>
          <p>
            Under certain circumstances, the Company may be required to disclose
            Your Personal Data if required to do so by law or in response to
            valid requests by public authorities.
          </p>

          <h2>Security of Your Personal Data</h2>
          <p>
            The security of Your Personal Data is important to Us. However, no
            method of transmission over the Internet or electronic storage is
            100% secure.
          </p>

          <h2>Service Providers</h2>

          <h3>Cloudflare Turnstile</h3>
          <p>
            Cloudflare Turnstile may process data in order to provide bot and
            abuse protection.
          </p>

          <p>
            Their Privacy Policy can be viewed at{" "}
            <a href="https://www.cloudflare.com/turnstile-privacy-policy/">
              https://www.cloudflare.com/turnstile-privacy-policy/
            </a>
          </p>

          <h2>Children&apos;s Privacy</h2>
          <p>
            Our Service does not address anyone under the age of 16. We do not
            knowingly collect personally identifiable information from anyone
            under the age of 16.
          </p>

          <h2>Links to Other Websites</h2>
          <p>
            Our Service may contain links to other websites that are not
            operated by Us. We strongly advise You to review the Privacy Policy
            of every site You visit.
          </p>

          <h2>Changes to this Privacy Policy</h2>
          <p>
            We may update Our Privacy Policy from time to time. Changes are
            effective when they are posted on this page.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, You can contact
            us by email:
          </p>

          <p>
            <a href="mailto:simon21.blum@gmail.com">simon21.blum@gmail.com</a>
          </p>
        </div>
      </article>
    </main>
  );
}
