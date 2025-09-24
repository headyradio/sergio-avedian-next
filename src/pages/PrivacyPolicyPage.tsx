import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - Sergio Avedian</title>
        <meta 
          name="description" 
          content="Privacy Policy for SergioAvedian.com - How we collect, use, and protect your personal information." 
        />
        <link rel="canonical" href="/privacy-policy" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16 lg:pt-32 lg:pb-20">
          <div className="editorial-container">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-8 text-text-primary">Privacy Policy</h1>
              
              <div className="prose prose-lg max-w-none text-text-secondary space-y-6">
                <p className="text-sm text-text-muted mb-6">Last updated: December 24, 2024</p>
                
                <p>This Privacy Policy explains how SergioAvedian.com (Sergio Avedian and related LLCs) collects, uses, shares, and safeguards personal information when providing online courses, webinars, personalized coaching, newsletters, and educational content. By using our services, creating an account, or subscribing to communications, you agree to this Policy.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Who we are</h2>
                <p>SergioAvedian.com is a U.S.-based educational platform offering investing education and related digital services. We do not provide personalized investment, legal, tax, or accounting advice.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Information we collect</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Identifiers and contact details:</strong> name, email, postal address, phone, account username.</li>
                  <li><strong>Commercial and payment information:</strong> purchase history, selected offerings, payment method tokens; full card data is processed by our payment processors and not stored on our servers.</li>
                  <li><strong>Account and course activity:</strong> login activity, course progress, quiz results, coaching scheduling notes.</li>
                  <li><strong>Communications:</strong> emails, support requests, survey responses, webinar Q&A/chat.</li>
                  <li><strong>Internet/technical data:</strong> IP address, device/browser type, approximate location, pages viewed, referring URLs, session duration, cookies and similar technology data.</li>
                  <li><strong>Social and referral information:</strong> when choosing to sign in with or link third‑party accounts or click referral links.</li>
                  <li><strong>Sensitive personal information:</strong> generally not collected; limited processing of payment card tokens occurs via PCI‑compliant processors. We do not use sensitive data to infer characteristics.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">How we collect data</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Directly from users (forms, checkout, coaching intake, webinars).</li>
                  <li>Automatically (cookies, pixels, SDKs, server logs, analytics).</li>
                  <li>From service providers and partners (Supabase backend services, ConvertKit email platform, payment processors, analytics, scheduling tools).</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">How we use data</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve courses, webinars, coaching, and site functionality.</li>
                  <li>Process transactions, verify accounts, provide support, and communicate about services.</li>
                  <li>Personalize learning experiences, recommend content, and measure engagement.</li>
                  <li>Send educational content, newsletters, and platform updates (opt out anytime).</li>
                  <li>Monitor performance, debug, prevent fraud, and ensure security and legal compliance.</li>
                  <li>Analyze usage to improve curricula, user experience, and content quality.</li>
                </ul>
                <p className="text-sm">Where required, we rely on one or more legal bases (consent, contract performance, legitimate interests, compliance with law).</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">How we share data</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Service providers:</strong> Supabase (backend infrastructure), ConvertKit (email marketing), payment processing, webinar hosting, analytics, cloud hosting, scheduling, customer support.</li>
                  <li><strong>Affiliates and related LLCs:</strong> for operations consistent with this Policy.</li>
                  <li><strong>Legal and safety:</strong> to comply with law, enforce terms, or protect rights, security, and integrity.</li>
                  <li><strong>Business transfers:</strong> in connection with a merger, acquisition, or asset sale.</li>
                </ul>
                <p className="text-sm">We do not sell personal information for money. We may "share" limited data for cross‑context behavioral advertising or analytics as defined under some state privacy laws; opt‑out options are provided below.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Advertising, analytics, and tracking</h2>
                <p>We use analytics tools to understand traffic and improve content and may use limited advertising or retargeting. Manage preferences via our cookie banner, browser controls, and the opt‑out links provided in the Cookie Policy. We endeavor to honor Global Privacy Control signals where applicable.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Data retention</h2>
                <p>We retain personal information only as long as necessary for the purposes described, including: active account life; course and certification administration; legal, tax, and audit requirements; and legitimate business needs. Typical retention periods range from the active relationship plus 1–7 years, unless a longer period is required by law or for dispute resolution.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Your choices</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Emails and newsletters:</strong> unsubscribe via the link in any message or in account settings.</li>
                  <li><strong>Cookies and tracking:</strong> manage via the cookie banner, browser settings, or device settings.</li>
                  <li><strong>Analytics/ads opt‑outs:</strong> see Cookie Policy for platform‑specific controls.</li>
                  <li><strong>Account:</strong> update profile details or request account deletion via privacy@sergioavedian.com.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Your privacy rights</h2>
                <p>Depending on residency (e.g., CA, CO, CT, UT, VA), rights may include: access/know, correction, deletion, portability, opt‑out of sale or sharing, and limiting use/disclosure of sensitive personal information. To exercise rights, submit a request to privacy@sergioavedian.com with sufficient detail to verify identity. We will not discriminate for exercising privacy rights. Authorized agents may act on a consumer's behalf where permitted by law.</p>
                
                <p><strong>California users:</strong> use the links "Do Not Sell or Share My Personal Information" and "Limit the Use of My Sensitive Personal Information" (available in the site footer) to manage CPRA choices. We do not use sensitive personal information to infer characteristics.</p>
                
                <p><strong>EEA/UK users:</strong> while the Services are U.S.‑focused, if accessing from the EEA/UK, you may have GDPR/UK GDPR rights (access, rectification, erasure, restriction, portability, objection). Our lawful bases include consent, contract, legal obligation, and legitimate interests. Data may be transferred to the U.S.; appropriate safeguards (e.g., SCCs) may apply.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Children's privacy</h2>
                <p>The Services are not directed to children under 13, and we do not knowingly collect personal information from them. If we learn we have collected such information, we will take appropriate steps to delete it.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Security</h2>
                <p>We use administrative, technical, and physical safeguards designed to protect personal information. No method of transmission or storage is 100% secure.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Third‑party links and platforms</h2>
                <p>Links to third‑party sites and tools are provided for convenience. Their privacy practices are governed by their policies.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Changes to this policy</h2>
                <p>We may update this Policy periodically. Material changes will be posted with a new "Last updated" date. Continued use signifies acceptance.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">California notice at collection</h2>
                <p>We collect the following categories for the purposes described above and retain them for the periods noted in "Data retention": identifiers (contact, account), commercial information (purchases), internet activity (usage/analytics), approximate geolocation, and in limited cases payment tokens. We do not sell personal information for money; we may share limited data for cross‑context behavioral advertising and provide opt‑outs. We do not use or disclose sensitive personal information to infer characteristics.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Contact us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                <div className="bg-muted p-4 rounded-lg">
                  <p><strong>SergioAvedian.com</strong></p>
                  <p>Email: privacy@sergioavedian.com</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicyPage;