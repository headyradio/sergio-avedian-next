import { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie Policy for SergioAvedian.com - How we use cookies and similar technologies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16 lg:pt-32 lg:pb-20">
        <div className="editorial-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-text-primary">Cookie Policy</h1>
            
            <div className="prose prose-lg max-w-none text-text-secondary space-y-6">
              <p className="text-sm text-text-muted mb-6">Last updated: January 24, 2025</p>
              
              <p>This Cookie Policy explains how SergioAvedian.com ("we," "us," or "our") uses cookies and similar tracking technologies when you visit our website. This policy should be read alongside our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">1. What Are Cookies?</h2>
              <p>Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners information about how visitors use their site.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">2. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3 text-text-primary">2.1 Strictly Necessary Cookies</h3>
              <p>These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and account access. You cannot opt out of these cookies as the website cannot function without them.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Authentication and login session cookies</li>
                <li>Security cookies to prevent fraud</li>
                <li>Load balancing cookies for server performance</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-text-primary">2.2 Analytics and Performance Cookies</h3>
              <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This data helps us improve the website and user experience.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Google Analytics (traffic analysis, user behavior)</li>
                <li>Page view tracking</li>
                <li>Performance monitoring</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-text-primary">2.3 Functionality Cookies</h3>
              <p>These cookies allow the website to remember choices you make and provide enhanced, more personalized features.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Language and region preferences</li>
                <li>Theme preferences (dark/light mode)</li>
                <li>Previously viewed content</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-text-primary">2.4 Marketing and Advertising Cookies</h3>
              <p>These cookies may be set by us or third-party advertising partners. They are used to build a profile of your interests and show you relevant advertisements on other sites.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Social media sharing buttons</li>
                <li>YouTube embedded video cookies</li>
                <li>Retargeting and remarketing cookies</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">3. Third-Party Cookies</h2>
              <p>We use services from third parties that may set their own cookies on your device. These include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Google Analytics:</strong> Website analytics and traffic measurement</li>
                <li><strong>YouTube:</strong> Embedded video content</li>
                <li><strong>Social Media Platforms:</strong> Share buttons and embedded content</li>
                <li><strong>Payment Processors:</strong> Secure payment processing</li>
                <li><strong>Email Marketing Services:</strong> Newsletter subscription tracking</li>
              </ul>
              <p className="mt-4">We do not control these third-party cookies. Please refer to the respective third-party privacy policies for more information.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">4. Similar Technologies</h2>
              <p>In addition to cookies, we may use other similar technologies:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Web Beacons:</strong> Small graphic images in emails or on web pages that track user actions</li>
                <li><strong>Pixels:</strong> Code snippets that collect information about browser activity</li>
                <li><strong>Local Storage:</strong> Browser-based storage for website preferences</li>
                <li><strong>Session Storage:</strong> Temporary data stored during a browsing session</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">5. How Long Do Cookies Last?</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain on your device for a set period (ranging from days to years) or until you delete them</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">6. Managing Your Cookie Preferences</h2>
              <p>You can control and manage cookies in several ways:</p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3 text-text-primary">6.1 Browser Settings</h3>
              <p>Most browsers allow you to control cookies through settings. You can typically:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>View and delete cookies</li>
                <li>Block all cookies</li>
                <li>Block third-party cookies only</li>
                <li>Accept or reject cookies on a site-by-site basis</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-text-primary">6.2 Opt-Out Links</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://tools.google.com/dlpage/gaoptout</a></li>
                <li>Network Advertising Initiative: <a href="https://optout.networkadvertising.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://optout.networkadvertising.org</a></li>
                <li>Digital Advertising Alliance: <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://optout.aboutads.info</a></li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">7. Impact of Disabling Cookies</h2>
              <p>If you choose to disable cookies, please note that some features of our website may not function properly. This may include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Inability to stay logged in</li>
                <li>Loss of saved preferences</li>
                <li>Reduced website functionality</li>
                <li>Degraded user experience</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">8. Do Not Track Signals</h2>
              <p>Some browsers have a "Do Not Track" feature that signals websites not to track your online activity. We currently do not respond to Do Not Track signals, but you can manage tracking through cookie settings as described above.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">9. Changes to This Cookie Policy</h2>
              <p>We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. We will post any changes on this page with an updated "Last updated" date.</p>

              <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">10. Contact Us</h2>
              <p>If you have questions about our use of cookies or this policy, please contact us:</p>
              <div className="bg-muted p-4 rounded-lg">
                <p><strong>SergioAvedian.com</strong></p>
                <p>Email: sergio@sergioavedian.com</p>
              </div>

              <p className="text-sm text-text-muted mt-8">
                See also our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> and <Link href="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
