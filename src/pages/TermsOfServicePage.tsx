import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const TermsOfServicePage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - Sergio Avedian</title>
        <meta 
          name="description" 
          content="Terms and Conditions for SergioAvedian.com - Educational platform offering trading courses, coaching, and market insights." 
        />
        <link rel="canonical" href="/terms-of-service" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16 lg:pt-32 lg:pb-20">
          <div className="editorial-container">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-8 text-text-primary">Terms of Service</h1>
              
              <div className="prose prose-lg max-w-none text-text-secondary space-y-6">
                <p className="text-sm text-text-muted mb-6">Last updated: December 24, 2024</p>
                
                <p>These Terms and Conditions ("Terms") govern access to and use of the SergioAvedian.com website and related services provided by Sergio Avedian and related LLCs (collectively, "SergioAvedian.com," "we," "us," or "our"). By accessing the website, purchasing courses, enrolling in coaching, joining webinars, or otherwise using any services or content (collectively, the "Services"), users agree to these Terms.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">About SergioAvedian.com</h2>
                <p>SergioAvedian.com is a U.S.-based educational platform offering online courses, webinars, coaching, articles, videos, newsletters, communities, and related digital resources intended for informational and educational purposes only.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Acceptance of Terms</h2>
                <p>By clicking "I Agree," creating an account, purchasing any offering, or using the Services, users acknowledge reading, understanding, and agreeing to be bound by these Terms and our Privacy Policy. If these Terms are not acceptable, do not access or use the Services.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Changes to Terms</h2>
                <p>We may update these Terms from time to time. Material changes will be posted on the website prior to taking effect. Continued use of the Services after changes are posted constitutes acceptance of the updated Terms.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Services and Content</h2>
                <p>"Content" includes information, text, images, videos, audio, code, tools, data, posts, comments, and any other materials provided through the Services. Access to certain Services may require an active account, purchase, or subscription.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Important Financial Disclaimer</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>SergioAvedian.com, its owners, officers, employees, contractors, mentors, and affiliates are not registered investment advisers, broker-dealers, or financial planners, and do not provide personalized investment, legal, tax, or accounting advice.</li>
                  <li>All information is provided for general educational purposes only and is not an offer, recommendation, or solicitation to buy or sell any security, option, cryptoasset, or other financial instrument.</li>
                  <li>Examples, case studies, and references to specific assets are illustrative and may not reflect actual trades or outcomes.</li>
                  <li>No outcome is promised or guaranteed; results vary and depend on numerous factors outside our control.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Risks and Personal Responsibility</h2>
                <p>Investing involves risk, including the possible loss of principal. Past performance does not guarantee future results. Decisions to buy, sell, hold, or trade any instrument should be made only after consulting a qualified, licensed professional who understands each user's individual circumstances. Users remain solely responsible for their financial decisions.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Accounts</h2>
                <p>Accounts may be required for access to certain Services. Users must provide accurate, current information, safeguard credentials, and accept responsibility for all account activity. Accounts may not be shared. Notify us promptly of unauthorized use or security concerns.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Privacy</h2>
                <p>Use of the Services is subject to our Privacy Policy available at SergioAvedian.com/privacy-policy. The Privacy Policy is incorporated by reference into these Terms.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Limited License</h2>
                <p>Subject to compliance with these Terms, we grant a limited, personal, non-exclusive, non-transferable, revocable license to access and use the Services for non-commercial, educational purposes. Users may not copy, redistribute, resell, make derivative works, or use the Services or Content for investment advisory, portfolio management, or any unlawful purpose.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">User Conduct</h2>
                <p>Users agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the Services for unlawful, harmful, fraudulent, or misleading purposes.</li>
                  <li>Upload or transmit malware, spam, or malicious code.</li>
                  <li>Harass, threaten, or infringe the rights of others.</li>
                  <li>Scrape, harvest, data mine, or reverse engineer the Services.</li>
                  <li>Share paid Content, course materials, recordings, or credentials without permission.</li>
                  <li>Record coaching sessions or closed webinars without prior written consent.</li>
                  <li>Use the Services to promote or sell competing products or services.</li>
                </ul>
                <p>We may remove content, suspend accounts, or restrict access for violations.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Intellectual Property</h2>
                <p>All Content and the Services, including copyrights, trademarks, logos, and other intellectual property, are owned by SergioAvedian.com or its licensors and are protected by applicable laws. "Sergio Avedian" and "SergioAvedian.com" are proprietary names and may not be used without written permission. No ownership rights are transferred by granting access to the Services.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">User Submissions</h2>
                <p>Users retain ownership of content submitted to forums, comments, or interactive features but grant SergioAvedian.com a worldwide, non-exclusive, transferable, sublicensable, royalty-free, perpetual license to use, host, reproduce, adapt, publish, display, and distribute such content for operating, improving, marketing, and promoting the Services. Do not submit content without necessary rights or permissions. We may moderate, edit, or remove submissions at our discretion.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Third-Party Links and Tools</h2>
                <p>The Services may link to third-party sites, tools, or content. We do not control and are not responsible for third-party materials. Use of third-party services is at each user's own risk and subject to third-party terms.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Fees, Payments, and Billing</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Offerings may include one-time purchases (e.g., courses), subscriptions (e.g., premium content or communities), and coaching packages.</li>
                  <li>Prices are shown before applicable taxes and fees. A valid payment method is required.</li>
                  <li>By purchasing, users authorize recurring charges for subscriptions until canceled in accordance with these Terms.</li>
                  <li>Users are responsible for promptly updating payment methods and resolving billing issues.</li>
                  <li>We may suspend or terminate access for unpaid or disputed charges.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Renewals and Cancellations (Subscriptions)</h2>
                <p>Subscriptions renew automatically for the same term at the then-current rate unless canceled before the renewal date in the account portal or via written notice in accordance with posted instructions. Access continues through the end of the paid term after cancellation; partial periods are not refunded unless required by law.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Suspension or Termination</h2>
                <p>We may suspend or terminate access, with or without notice, for violations of these Terms, nonpayment, fraud, security risks, or as required by law. Upon termination, all licenses granted under these Terms end, but sections intended to survive (e.g., IP, disclaimers, limitation of liability, arbitration) will remain in effect.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">100% Satisfaction Guaranteed Policy</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>If you did not find significant value or are dissatisfied with the paid coaching, webinar or course you have purchased, SergioAvedian.com will offer a full refund upon request.</li>
                  <li>If SergioAvedian.com cancels a course or event, affected users will receive a refund.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Disclaimer of Warranties</h2>
                <p>The Services and all Content are provided "as is" and "as available." To the fullest extent permitted by law, we disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, title, non-infringement, accuracy, and reliability. We do not warrant uninterrupted or error-free operation or that defects will be corrected.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Limitation of Liability</h2>
                <p>To the fullest extent permitted by law, SergioAvedian.com and its related entities, owners, officers, employees, contractors, and agents will not be liable for any indirect, incidental, consequential, special, exemplary, or punitive damages, or any loss of profits, data, use, goodwill, or other intangible losses arising out of or related to the Services. In no event will aggregate liability exceed the greater of $100 or the total amount paid by the user for the Services during the six months preceding the claim.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Indemnification</h2>
                <p>Users agree to defend, indemnify, and hold harmless SergioAvedian.com and related entities and personnel from and against claims, liabilities, damages, losses, and expenses (including reasonable attorneys' fees) arising from or related to use of the Services, violation of these Terms, infringement of third-party rights, or misuse of Content.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Governing Law; Arbitration; Class Action Waiver</h2>
                <p>These Terms are governed by the laws of the State of California, without regard to conflict-of-law principles. Any dispute, claim, or controversy arising out of or relating to these Terms or the Services will be resolved by binding individual arbitration administered by JAMS or AAA in Los Angeles County, California, under their applicable rules. Users and SergioAvedian.com waive the right to a jury trial and to participate in any class or representative action. The arbitrator may not consolidate claims of multiple parties. Judgment on the award may be entered in any court of competent jurisdiction. Notwithstanding the foregoing, either party may seek injunctive or equitable relief in court for intellectual property or unauthorized access/use issues.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">International Users</h2>
                <p>The Services are controlled from the United States and intended primarily for U.S. residents. Users accessing the Services from other jurisdictions are responsible for compliance with local laws and must not use the Services where prohibited.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Minors</h2>
                <p>The Services are not directed to children. Individuals under the age of majority in their jurisdiction may use the Services only with the consent and supervision of a parent or legal guardian.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Miscellaneous</h2>
                <p>If any provision is held invalid, the remaining provisions remain in full force. No waiver of any term is a continuing waiver. Users may not assign these Terms; we may assign them. Notices may be provided via email, account notifications, or website postings. Headings are for convenience only.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Contact</h2>
                <p>Questions regarding these Terms or the Services may be directed to:</p>
                <div className="bg-muted p-4 rounded-lg">
                  <p><strong>SergioAvedian.com</strong></p>
                  <p>Email: sergio@sergioavedian.com</p>
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

export default TermsOfServicePage;