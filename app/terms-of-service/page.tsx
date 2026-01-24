import { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and Conditions for SergioAvedian.com - Educational platform offering trading courses, coaching, and market insights.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16 lg:pt-32 lg:pb-20">
        <div className="editorial-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-text-primary">Terms of Service</h1>
            
            <div className="prose prose-lg max-w-none text-text-secondary space-y-6">
              <p className="text-sm text-text-muted mb-6">Last updated: January 24, 2025</p>
              
              <p>These Terms of Service ("Terms") govern your access to and use of the SergioAvedian.com website (the "Site") and all related services, content, courses, coaching, newsletters, videos, and materials (collectively, the "Services") operated by Sergio Avedian ("we," "us," or "our"). By accessing or using the Services, you agree to be bound by these Terms. If you do not agree, do not use the Services.</p>

              {/* Important Disclaimer Box */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 my-8">
                <h3 className="text-lg font-bold text-amber-400 mb-3">⚠️ IMPORTANT INVESTMENT DISCLAIMER</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  <strong>Investments or strategies mentioned on this website, YouTube channel, or any of our content may not be suitable for you and you should make your own independent decisions. You should strongly consider seeking advice from a qualified investment advisor before making any investment decisions. Past performance is not indicative of future results.</strong>
                </p>
              </div>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">1. About SergioAvedian.com</h2>
              <p>SergioAvedian.com is a U.S.-based educational platform offering online courses, webinars, coaching, articles, videos, newsletters, and related digital resources. All content is intended for informational and educational purposes only and does not constitute financial, investment, tax, legal, or professional advice.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">2. No Investment Advice</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>SergioAvedian.com and Sergio Avedian are <strong>NOT</strong> registered investment advisers, broker-dealers, financial planners, or licensed professionals under FINRA, SEC, or any other regulatory authority.</li>
                <li>All information, commentary, opinions, and materials on this Site are provided for <strong>general educational and informational purposes only</strong>.</li>
                <li>Nothing on this Site should be construed as an offer, solicitation, or recommendation to buy, sell, or hold any security, investment, or financial product.</li>
                <li>We do not provide personalized investment advice. Any investment decisions you make are solely your responsibility.</li>
                <li>You should consult with a qualified financial advisor, attorney, or tax professional before making any investment or financial decisions.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">3. Risk Disclosure</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Investing involves risk, including the possible loss of principal.</strong> The value of investments can go down as well as up.</li>
                <li>Past performance is not a guarantee or indicator of future results.</li>
                <li>No trading strategy or approach guarantees profits or prevents losses.</li>
                <li>The information provided does not take into account your individual financial situation, objectives, risk tolerance, or investment time horizon.</li>
                <li>You should not invest money you cannot afford to lose.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">4. Disclaimer of Warranties</h2>
              <p>THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Warranties of merchantability or fitness for a particular purpose</li>
                <li>Warranties that the Services will be uninterrupted, error-free, or secure</li>
                <li>Warranties regarding the accuracy, reliability, or completeness of any content</li>
                <li>Warranties that any information will result in profitable trading or investment outcomes</li>
              </ul>
              <p className="mt-4">We do not warrant or guarantee any specific results from using our educational materials, courses, or coaching services.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">5. Limitation of Liability</h2>
              <p className="font-semibold">TO THE MAXIMUM EXTENT PERMITTED BY LAW, SERGIO AVEDIAN, SERGIOAVEDIAN.COM, AND ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND LICENSORS SHALL NOT BE LIABLE FOR:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Any direct, indirect, incidental, special, consequential, or punitive damages</li>
                <li>Any loss of profits, revenue, data, or goodwill</li>
                <li>Any investment losses, trading losses, or financial damages of any kind</li>
                <li>Any damages arising from your reliance on information or content on this Site</li>
                <li>Any damages resulting from your use or inability to use the Services</li>
                <li>Any damages caused by third parties, including service providers or linked websites</li>
              </ul>
              <p className="mt-4">This limitation applies regardless of the theory of liability (contract, tort, negligence, strict liability, or otherwise), even if we have been advised of the possibility of such damages. In no event shall our total liability exceed the amount you paid for the specific Service giving rise to the claim, or $100, whichever is less.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">6. Indemnification</h2>
              <p>You agree to indemnify, defend, and hold harmless Sergio Avedian, SergioAvedian.com, and its affiliates from any claims, damages, losses, liabilities, costs, and expenses (including attorneys' fees) arising from:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use of the Services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of third parties</li>
                <li>Any investment or trading decisions you make based on information from the Services</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">7. User Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are solely responsible for evaluating any information, opinion, or content provided through the Services</li>
                <li>You must conduct your own research and due diligence before making any investment decision</li>
                <li>You agree not to hold us liable for any decisions you make based on our content</li>
                <li>You must comply with all applicable laws and regulations in your jurisdiction</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">8. Intellectual Property</h2>
              <p>All content on the Site, including text, graphics, logos, images, videos, courses, and software, is owned by or licensed to SergioAvedian.com and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our written permission.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">9. Refund Policy</h2>
              <p>If you are dissatisfied with any paid coaching, webinar, or course you have purchased, we offer a 100% satisfaction guarantee. Contact us within 30 days of purchase to request a full refund.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">10. Privacy</h2>
              <p>Your use of the Services is also governed by our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>, which is incorporated into these Terms by reference.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">11. Third-Party Links and Content</h2>
              <p>The Site may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of third-party sites. Your use of third-party sites is at your own risk.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">12. Modifications to Terms</h2>
              <p>We reserve the right to modify these Terms at any time. Changes will be effective upon posting to the Site with an updated date. Your continued use of the Services after any changes constitutes acceptance of the modified Terms.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">13. Governing Law and Jurisdiction</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of the State of California, USA, without regard to conflict of law principles. Any disputes shall be resolved in the state or federal courts located in Los Angeles County, California.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">14. Severability</h2>
              <p>If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">15. Entire Agreement</h2>
              <p>These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and SergioAvedian.com regarding your use of the Services.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">16. Contact</h2>
              <div className="bg-muted p-4 rounded-lg">
                <p><strong>SergioAvedian.com</strong></p>
                <p>Email: sergio@sergioavedian.com</p>
              </div>

              <p className="text-sm text-text-muted mt-8">
                See also our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> and <Link href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
