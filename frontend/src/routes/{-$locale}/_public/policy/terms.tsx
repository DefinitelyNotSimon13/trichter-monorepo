import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/{-$locale}/_public/policy/terms")({
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
            Terms and Conditions
          </h1>

          <p className="mt-4 text-sm text-muted-foreground">
            Last updated: April 24, 2026
          </p>
        </header>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-headings:font-semibold prose-h2:mt-10 prose-h2:border-b prose-h2:pb-2 prose-h3:mt-8 prose-p:leading-7 prose-li:leading-7">
          <Terms />
        </div>
      </article>
    </main>
  );
}

function Terms() {
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold prose-h2:mt-10 prose-h2:border-b prose-h2:pb-2 prose-h3:mt-8 prose-p:leading-7 prose-li:leading-7">
      <h2>Agreement to Our Legal Terms</h2>

      <p>
        We are <strong>Trichter</strong> ("Company", "we", "us", or "our").
      </p>

      <p>
        We operate the website{" "}
        <a href="https://trichter.hauptspeicher.com">
          https://trichter.hauptspeicher.com
        </a>
        , the mobile application <strong>Trichter</strong>, and other related
        products and services that refer or link to these Legal Terms
        (collectively, the "Services").
      </p>

      <p>
        These Legal Terms constitute a legally binding agreement between you and
        Trichter concerning your access to and use of the Services. By accessing
        the Services, you confirm that you have read, understood, and agreed to
        be bound by these Legal Terms.
      </p>

      <p>
        If you do not agree with these Legal Terms, you are prohibited from
        using the Services and must discontinue use immediately.
      </p>

      <p>
        The Services are intended for users who are at least 18 years old.
        Persons under 18 are not permitted to use or register for the Services.
      </p>

      <h2>1. Our Services</h2>

      <p>
        The Services are not intended for distribution to or use by any person
        or entity in any jurisdiction where such distribution or use would be
        contrary to law or regulation. Users who access the Services from other
        locations are responsible for compliance with local laws.
      </p>

      <h2>2. Intellectual Property Rights</h2>

      <h3>Our Intellectual Property</h3>

      <p>
        We own or license all intellectual property rights in our Services,
        including source code, databases, functionality, software, website
        designs, text, graphics, trademarks, service marks, and logos.
      </p>

      <p>
        The Content and Marks are provided through the Services "as is" for your
        personal, non-commercial use or internal business purposes only.
      </p>

      <h3>Your Use of Our Services</h3>

      <p>
        Subject to your compliance with these Legal Terms, we grant you a
        non-exclusive, non-transferable, revocable licence to access the
        Services and download or print portions of Content for personal,
        non-commercial use or internal business purposes.
      </p>

      <p>
        No part of the Services, Content, or Marks may be copied, reproduced,
        distributed, sold, licensed, or otherwise exploited for commercial
        purposes without our prior written permission.
      </p>

      <h3>Your Submissions and Contributions</h3>

      <p>
        By sending us questions, comments, suggestions, feedback, or other
        information about the Services ("Submissions"), you assign to us all
        intellectual property rights in those Submissions.
      </p>

      <p>
        If you post content through the Services ("Contributions"), you grant us
        a worldwide, royalty-free licence to use, reproduce, distribute,
        display, and otherwise exploit those Contributions as permitted by these
        Legal Terms.
      </p>

      <p>
        You are solely responsible for your Submissions and Contributions. We
        may remove or edit Contributions that we consider harmful or in breach
        of these Legal Terms.
      </p>

      <h2>3. User Representations</h2>

      <p>By using the Services, you represent and warrant that:</p>

      <ul>
        <li>Your registration information is accurate and complete.</li>
        <li>You will keep your information up to date.</li>
        <li>You have legal capacity to agree to these Legal Terms.</li>
        <li>You are not a minor in your jurisdiction.</li>
        <li>You will not use automated or non-human access methods.</li>
        <li>You will not use the Services for illegal purposes.</li>
        <li>Your use of the Services will comply with applicable law.</li>
      </ul>

      <h2>4. User Registration</h2>

      <p>
        You may be required to register to use the Services. You are responsible
        for keeping your password confidential and for all activity under your
        account.
      </p>

      <h2>5. Prohibited Activities</h2>

      <p>You agree not to:</p>

      <ul>
        <li>
          Systematically collect data from the Services without permission.
        </li>
        <li>Mislead, defraud, or harm us or other users.</li>
        <li>Interfere with security-related features.</li>
        <li>Use information from the Services to harass or harm others.</li>
        <li>Use the Services contrary to applicable laws or regulations.</li>
        <li>Upload viruses, malware, spam, or disruptive material.</li>
        <li>Use bots, scrapers, or automated extraction tools.</li>
        <li>Impersonate another person or user.</li>
        <li>Interfere with or disrupt the Services.</li>
        <li>Reverse engineer or copy the Services' software.</li>
        <li>Create accounts by automated means or false pretences.</li>
        <li>Use the Services to compete with us.</li>
        <li>Sell or transfer your profile.</li>
        <li>Advertise or sell goods and services without approval.</li>
      </ul>

      <h2>6. User Generated Contributions</h2>

      <p>
        The Services may allow you to create, submit, post, display, transmit,
        or publish content and materials. Contributions may be viewable by other
        users and may be treated as non-confidential and non-proprietary.
      </p>

      <p>When you make Contributions, you represent that:</p>

      <ul>
        <li>You own or have the necessary rights to your Contributions.</li>
        <li>Your Contributions do not infringe third-party rights.</li>
        <li>Your Contributions are not false, misleading, or unlawful.</li>
        <li>
          Your Contributions are not abusive, obscene, harassing, or hateful.
        </li>
        <li>Your Contributions do not violate privacy or publicity rights.</li>
        <li>Your Contributions comply with these Legal Terms.</li>
      </ul>

      <h2>7. Contribution Licence</h2>

      <p>
        By posting Contributions, you grant us a worldwide, transferable,
        royalty-free licence to host, use, copy, reproduce, publish, display,
        distribute, and adapt your Contributions in connection with the
        Services.
      </p>

      <p>
        You retain ownership of your Contributions. We are not responsible for
        statements or representations made in your Contributions.
      </p>

      <h2>8. Mobile Application Licence</h2>

      <h3>Use Licence</h3>

      <p>
        If you access the Services through the App, we grant you a revocable,
        non-exclusive, non-transferable, limited right to install and use the
        App on devices you own or control.
      </p>

      <p>You may not:</p>

      <ul>
        <li>Reverse engineer, decompile, or disassemble the App.</li>
        <li>
          Modify, adapt, translate, or create derivative works of the App.
        </li>
        <li>Use the App in violation of applicable laws.</li>
        <li>Remove proprietary notices.</li>
        <li>Use the App for unauthorised commercial purposes.</li>
        <li>Use the App to create a competing product or service.</li>
      </ul>

      <h3>Apple and Android Devices</h3>

      <p>
        If you obtain the App through an app distributor, your use of the App is
        also subject to the applicable distributor’s terms and conditions.
      </p>

      <h2>9. Social Media</h2>

      <p>
        The Services may allow you to link your account with third-party social
        media accounts. Your relationship with those third-party providers is
        governed solely by your agreements with them.
      </p>

      <p>
        You may disable the connection between your account and third-party
        accounts through your account settings, where available.
      </p>

      <h2>10. Services Management</h2>

      <p>
        We reserve the right to monitor the Services for violations, restrict or
        disable access, remove excessive or harmful content, and otherwise
        manage the Services to protect our rights and ensure proper operation.
      </p>

      <h2>11. Privacy Policy</h2>

      <p>
        Please review our Privacy Policy:{" "}
        <a href="https://trichter.hauptspeicher.com/policy/privacy">
          https://trichter.hauptspeicher.com/policy/privacy
        </a>
        .
      </p>

      <p>
        By using the Services, you agree to be bound by our Privacy Policy,
        which is incorporated into these Legal Terms.
      </p>

      <h2>12. Copyright Infringements</h2>

      <p>
        We respect the intellectual property rights of others. If you believe
        material available through the Services infringes your copyright, please
        notify us using the contact information below.
      </p>

      <h2>13. Term and Termination</h2>

      <p>
        These Legal Terms remain in full force while you use the Services. We
        may deny access, suspend, terminate, or delete your account if you
        breach these Legal Terms or applicable law.
      </p>

      <p>
        If your account is terminated or suspended, you may not create another
        account under your own name, a fake name, or the name of another person.
      </p>

      <h2>14. Modifications and Interruptions</h2>

      <p>
        We may change, modify, suspend, or discontinue the Services at any time.
        We cannot guarantee that the Services will always be available or free
        from interruptions, delays, or errors.
      </p>

      <h2>15. Governing Law</h2>

      <p>
        These Legal Terms are governed by the laws of Germany. If you are a
        consumer residing in the EU, you also benefit from mandatory consumer
        protection provisions in your country of residence.
      </p>

      <h2>16. Dispute Resolution</h2>

      <h3>Informal Negotiations</h3>

      <p>
        The parties agree to first attempt to resolve disputes informally for at
        least thirty (30) days before initiating arbitration or other formal
        proceedings.
      </p>

      <h3>Binding Arbitration</h3>

      <p>
        Any dispute arising from these Legal Terms shall be determined by one
        arbitrator under the rules of the European Court of Arbitration. The
        seat of arbitration shall be Friedrichshafen, Germany. The proceedings
        may be conducted in English or German.
      </p>

      <h3>Exceptions</h3>

      <p>
        Disputes relating to intellectual property rights, theft, piracy,
        unauthorised use, privacy violations, or claims for injunctive relief
        are not subject to the arbitration provisions above.
      </p>

      <h2>17. Corrections</h2>

      <p>
        The Services may contain typographical errors, inaccuracies, or
        omissions. We reserve the right to correct or update information at any
        time without prior notice.
      </p>

      <h2>18. Disclaimer</h2>

      <p>
        The Services are provided on an "as-is" and "as-available" basis. Your
        use of the Services is at your sole risk.
      </p>

      <p>
        To the fullest extent permitted by law, we disclaim all warranties,
        express or implied, including warranties of merchantability, fitness for
        a particular purpose, and non-infringement.
      </p>

      <h2>19. Limitations of Liability</h2>

      <p>
        To the fullest extent permitted by law, we will not be liable for
        indirect, consequential, exemplary, incidental, special, or punitive
        damages, including lost profits, lost revenue, or loss of data arising
        from your use of the Services.
      </p>

      <h2>20. Indemnification</h2>

      <p>
        You agree to defend, indemnify, and hold us harmless from claims,
        losses, damages, liabilities, and expenses arising from your
        Contributions, your use of the Services, your breach of these Legal
        Terms, or your violation of third-party rights or applicable law.
      </p>

      <h2>21. User Data</h2>

      <p>
        We may maintain data that you transmit to the Services for the purpose
        of managing the Services. You are responsible for all data you transmit
        or activity performed through your account.
      </p>

      <h2>22. Electronic Communications, Transactions, and Signatures</h2>

      <p>
        Visiting the Services, sending emails, and completing online forms
        constitute electronic communications. You consent to receive electronic
        communications and agree that electronic notices satisfy legal written
        communication requirements.
      </p>

      <h2>23. Miscellaneous</h2>

      <p>
        These Legal Terms and any policies posted by us constitute the entire
        agreement between you and us. If any provision is found unlawful or
        unenforceable, the remaining provisions remain valid and enforceable.
      </p>

      <h2>24. Contact Us</h2>

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
        Phone: <a href="tel:+491778799440">+49 177 8799440</a>
      </p>

      <p>
        You can also reach us via our{" "}
        <Link to="/{-$locale}/contact">contact form</Link>.
      </p>
    </div>
  );
}
