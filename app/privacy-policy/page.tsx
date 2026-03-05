import { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ManageCookiesLink from "@/components/ManageCookiesLink";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for SergioAvedian.com - How we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16 lg:pt-32 lg:pb-20">
        <div className="editorial-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Privacy Policy</h1>
            <p className="text-sm text-text-secondary mb-8">Last updated: January 24, 2025</p>
            
            <div className="prose prose-lg max-w-none space-y-6">
              <p className="text-gray-300 leading-relaxed">This Privacy Policy describes how SergioAvedian.com ("we," "us," or "our") collects, uses, shares, and protects your personal information when you visit our website, subscribe to our services, or otherwise interact with us. By using our website, you consent to the practices described in this policy.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">1. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-200">1.1 Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-3 text-gray-300">
                <li><span className="text-white font-medium">Account Information:</span> Name, email address, and password when you create an account or subscribe to our newsletter.</li>
                <li><span className="text-white font-medium">Contact Information:</span> Information you provide when contacting us through forms, email, or other means.</li>
                <li><span className="text-white font-medium">Payment Information:</span> Payment details processed through secure third-party payment processors (we do not store full credit card numbers).</li>
                <li><span className="text-white font-medium">Communications:</span> Content of messages you send us or post on our platform.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-200">1.2 Information Collected Automatically</h3>
              <ul className="list-disc pl-6 space-y-3 text-gray-300">
                <li><span className="text-white font-medium">Usage Data:</span> Pages visited, time spent on pages, links clicked, and browsing patterns.</li>
                <li><span className="text-white font-medium">Device Information:</span> Browser type, operating system, device type, screen resolution, and IP address.</li>
                <li><span className="text-white font-medium">Location Data:</span> General geographic location based on IP address.</li>
                <li><span className="text-white font-medium">Cookies and Tracking Technologies:</span> As described in our <Link href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>To provide, maintain, and improve our services</li>
                <li>To process transactions and send related information</li>
                <li>To send newsletters, marketing communications, and promotional materials (with your consent)</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To analyze usage patterns and improve user experience</li>
                <li>To detect, prevent, and address technical issues or fraud</li>
                <li>To comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">3. Information Sharing and Disclosure</h2>
              <p className="text-gray-300 leading-relaxed">We do not sell your personal information. We may share information with:</p>
              <ul className="list-disc pl-6 space-y-3 text-gray-300 mt-4">
                <li><span className="text-white font-medium">Service Providers:</span> Third parties who perform services on our behalf (payment processing, email delivery, analytics, hosting).</li>
                <li><span className="text-white font-medium">Legal Requirements:</span> When required by law, subpoena, or legal process.</li>
                <li><span className="text-white font-medium">Protection of Rights:</span> To protect our rights, privacy, safety, or property, or that of our users or the public.</li>
                <li><span className="text-white font-medium">Business Transfers:</span> In connection with a merger, acquisition, or sale of assets.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">4. Data Security</h2>
              <p className="text-gray-300 leading-relaxed">We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">5. Data Retention</h2>
              <p className="text-gray-300 leading-relaxed">We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">6. Analytics Tracking &amp; Your Consent (CIPA / CCPA)</h2>
              <p className="text-gray-300 leading-relaxed">
                We are committed to full compliance with the <strong className="text-white">California Invasion of Privacy Act (CIPA)</strong> and the{" "}
                <strong className="text-white">California Consumer Privacy Act (CCPA)</strong>. Under these laws, we require your affirmative opt-in consent before any tracking technologies are activated.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-200">What we track (with consent only)</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                We use <strong className="text-white">Google Analytics 4 (GA4)</strong> and <strong className="text-white">Google Tag Manager (GTM)</strong> solely to understand how visitors interact with this site. No advertising networks or third-party data brokers are involved. When you consent, GA4 may collect:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Pages visited and time spent on each page</li>
                <li>General session data (entry/exit pages, session duration)</li>
                <li>Device and browser information (type, OS, screen resolution)</li>
                <li>Approximate geographic location (country/city, derived from IP — IP is not stored)</li>
                <li>Referral source (how you arrived at the site)</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-200">Why we collect it</h3>
              <p className="text-gray-300 leading-relaxed">
                Analytics data is used exclusively to improve the site — understanding which content is most useful, identifying technical issues, and measuring overall site performance. We do not use this data for advertising targeting or sell it to any third party.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-200">How consent works</h3>
              <p className="text-gray-300 leading-relaxed">
                We implement <strong className="text-white">Google Consent Mode v2</strong>. All GA4 tracking signals default to <code className="bg-surface px-1.5 py-0.5 rounded text-sm">denied</code> on page load. No cookies are set and no data is sent to Google until you explicitly click <strong className="text-white">Accept</strong> on the cookie banner. If you click <strong className="text-white">Decline</strong>, no tracking occurs for your session or any future visit — your choice is saved in your browser.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-200">How to opt out or change your preference</h3>
              <ul className="list-disc pl-6 space-y-3 text-gray-300">
                <li>
                  <strong className="text-white">On this site:</strong>{" "}
                  <ManageCookiesLink /> at any time to review or change your consent.
                </li>
                <li>
                  <strong className="text-white">Google&apos;s opt-out tool:</strong>{" "}
                  Install the{" "}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google Analytics Opt-out Browser Add-on
                  </a>{" "}
                  to block GA across all sites.
                </li>
                <li>
                  <strong className="text-white">Browser-level:</strong> Use your browser&apos;s privacy settings or a content blocker to prevent tracking scripts from loading.
                </li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-200">Your CCPA rights regarding analytics data</h3>
              <p className="text-gray-300 leading-relaxed">
                California residents have the right to know what personal information is collected, request deletion, and opt out of sale. We do <strong className="text-white">not sell</strong> any personal information. To exercise your rights, email{" "}
                <a href="mailto:sergio@sergioavedian.com" className="text-primary hover:underline">
                  sergio@sergioavedian.com
                </a>
                .
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">7. Your Rights and Choices</h2>
              <p className="text-gray-300 leading-relaxed mb-4">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-6 space-y-3 text-gray-300">
                <li><span className="text-white font-medium">Access:</span> Request access to your personal information.</li>
                <li><span className="text-white font-medium">Correction:</span> Request correction of inaccurate or incomplete data.</li>
                <li><span className="text-white font-medium">Deletion:</span> Request deletion of your personal information.</li>
                <li><span className="text-white font-medium">Portability:</span> Request a copy of your data in a portable format.</li>
                <li><span className="text-white font-medium">Opt-Out:</span> Unsubscribe from marketing communications at any time.</li>
                <li><span className="text-white font-medium">Withdraw Consent:</span> Withdraw consent where processing is based on consent.</li>
              </ul>
              <p className="text-gray-300 mt-4">To exercise these rights, contact us at <a href="mailto:sergio@sergioavedian.com" className="text-primary hover:underline">sergio@sergioavedian.com</a>.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">8. Third-Party Links</h2>
              <p className="text-gray-300 leading-relaxed">Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to read the privacy policies of any third-party sites you visit.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">9. Children&apos;s Privacy</h2>
              <p className="text-gray-300 leading-relaxed">Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child, we will take steps to delete such information.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">10. International Users</h2>
              <p className="text-gray-300 leading-relaxed">Our website is operated in the United States. If you are accessing our site from outside the U.S., please be aware that your information may be transferred to, stored, and processed in the U.S. where data protection laws may differ from those in your country.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">11. Changes to This Policy</h2>
              <p className="text-gray-300 leading-relaxed">We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page with an updated &quot;Last updated&quot; date. Your continued use of our services after any changes constitutes acceptance of the updated policy.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">12. Contact Us</h2>
              <div className="bg-surface p-6 rounded-lg border border-border/50">
                <p className="text-white font-medium">SergioAvedian.com</p>
                <p className="text-gray-300 mt-1">Email: <a href="mailto:sergio@sergioavedian.com" className="text-primary hover:underline">sergio@sergioavedian.com</a></p>
              </div>

              <p className="text-gray-400 text-sm mt-10 pt-6 border-t border-border/30">
                See also our <Link href="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
