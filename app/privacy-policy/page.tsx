import { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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
            <h1 className="text-4xl font-bold mb-8 text-text-primary">Privacy Policy</h1>
            
            <div className="prose prose-lg max-w-none text-text-secondary space-y-6">
              <p className="text-sm text-text-muted mb-6">Last updated: January 24, 2025</p>
              
              <p>This Privacy Policy describes how SergioAvedian.com ("we," "us," or "our") collects, uses, shares, and protects your personal information when you visit our website, subscribe to our services, or otherwise interact with us. By using our website, you consent to the practices described in this policy.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">1. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3 text-text-primary">1.1 Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information:</strong> Name, email address, and password when you create an account or subscribe to our newsletter.</li>
                <li><strong>Contact Information:</strong> Information you provide when contacting us through forms, email, or other means.</li>
                <li><strong>Payment Information:</strong> Payment details processed through secure third-party payment processors (we do not store full credit card numbers).</li>
                <li><strong>Communications:</strong> Content of messages you send us or post on our platform.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-text-primary">1.2 Information Collected Automatically</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Usage Data:</strong> Pages visited, time spent on pages, links clicked, and browsing patterns.</li>
                <li><strong>Device Information:</strong> Browser type, operating system, device type, screen resolution, and IP address.</li>
                <li><strong>Location Data:</strong> General geographic location based on IP address.</li>
                <li><strong>Cookies and Tracking Technologies:</strong> As described in our <Link href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide, maintain, and improve our services</li>
                <li>To process transactions and send related information</li>
                <li>To send newsletters, marketing communications, and promotional materials (with your consent)</li>
                <li>To respond to your inquiries and provide customer support</li>
                <li>To analyze usage patterns and improve user experience</li>
                <li>To detect, prevent, and address technical issues or fraud</li>
                <li>To comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">3. Information Sharing and Disclosure</h2>
              <p>We do not sell your personal information. We may share information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> Third parties who perform services on our behalf (payment processing, email delivery, analytics, hosting).</li>
                <li><strong>Legal Requirements:</strong> When required by law, subpoena, or legal process.</li>
                <li><strong>Protection of Rights:</strong> To protect our rights, privacy, safety, or property, or that of our users or the public.</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">4. Data Security</h2>
              <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">5. Data Retention</h2>
              <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">6. Your Rights and Choices</h2>
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request access to your personal information.</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information.</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format.</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time.</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent.</li>
              </ul>
              <p className="mt-4">To exercise these rights, contact us at sergio@sergioavedian.com.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">7. Third-Party Links</h2>
              <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to read the privacy policies of any third-party sites you visit.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">8. Children's Privacy</h2>
              <p>Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child, we will take steps to delete such information.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">9. International Users</h2>
              <p>Our website is operated in the United States. If you are accessing our site from outside the U.S., please be aware that your information may be transferred to, stored, and processed in the U.S. where data protection laws may differ from those in your country.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">10. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page with an updated "Last updated" date. Your continued use of our services after any changes constitutes acceptance of the updated policy.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">11. Contact Us</h2>
              <div className="bg-muted p-4 rounded-lg">
                <p><strong>SergioAvedian.com</strong></p>
                <p>Email: sergio@sergioavedian.com</p>
              </div>

              <p className="text-sm text-text-muted mt-8">
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
