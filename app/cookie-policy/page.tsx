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
            <h1 className="text-4xl font-bold mb-4 text-foreground">Cookie Policy</h1>
            <p className="text-sm text-text-secondary mb-8">Last updated: January 24, 2025</p>
            
            <div className="prose prose-lg max-w-none space-y-6">
              <p className="text-gray-300 leading-relaxed">This Cookie Policy explains how SergioAvedian.com ("we," "us," or "our") uses cookies and similar tracking technologies when you visit our website. This policy should be read alongside our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">1. What Are Cookies?</h2>
              <p className="text-gray-300 leading-relaxed">Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners information about how visitors use their site.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">2. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-200">2.1 Strictly Necessary Cookies</h3>
              <p className="text-gray-300 leading-relaxed mb-3">These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and account access. You cannot opt out of these cookies as the website cannot function without them.</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Authentication and login session cookies</li>
                <li>Security cookies to prevent fraud</li>
                <li>Load balancing cookies for server performance</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-200">2.2 Analytics and Performance Cookies</h3>
              <p className="text-gray-300 leading-relaxed mb-3">These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This data helps us improve the website and user experience.</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Google Analytics (traffic analysis, user behavior)</li>
                <li>Page view tracking</li>
                <li>Performance monitoring</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-200">2.3 Functionality Cookies</h3>
              <p className="text-gray-300 leading-relaxed mb-3">These cookies allow the website to remember choices you make and provide enhanced, more personalized features.</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Language and region preferences</li>
                <li>Theme preferences (dark/light mode)</li>
                <li>Previously viewed content</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-200">2.4 Marketing and Advertising Cookies</h3>
              <p className="text-gray-300 leading-relaxed mb-3">These cookies may be set by us or third-party advertising partners. They are used to build a profile of your interests and show you relevant advertisements on other sites.</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Social media sharing buttons</li>
                <li>YouTube embedded video cookies</li>
                <li>Retargeting and remarketing cookies</li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">3. Third-Party Cookies</h2>
              <p className="text-gray-300 leading-relaxed mb-4">We use services from third parties that may set their own cookies on your device. These include:</p>
              <ul className="list-disc pl-6 space-y-3 text-gray-300">
                <li><span className="text-white font-medium">Google Analytics:</span> Website analytics and traffic measurement</li>
                <li><span className="text-white font-medium">YouTube:</span> Embedded video content</li>
                <li><span className="text-white font-medium">Social Media Platforms:</span> Share buttons and embedded content</li>
                <li><span className="text-white font-medium">Payment Processors:</span> Secure payment processing</li>
                <li><span className="text-white font-medium">Email Marketing Services:</span> Newsletter subscription tracking</li>
              </ul>
              <p className="text-gray-300 mt-4 leading-relaxed">We do not control these third-party cookies. Please refer to the respective third-party privacy policies for more information.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">4. Similar Technologies</h2>
              <p className="text-gray-300 leading-relaxed mb-4">In addition to cookies, we may use other similar technologies:</p>
              <ul className="list-disc pl-6 space-y-3 text-gray-300">
                <li><span className="text-white font-medium">Web Beacons:</span> Small graphic images in emails or on web pages that track user actions</li>
                <li><span className="text-white font-medium">Pixels:</span> Code snippets that collect information about browser activity</li>
                <li><span className="text-white font-medium">Local Storage:</span> Browser-based storage for website preferences</li>
                <li><span className="text-white font-medium">Session Storage:</span> Temporary data stored during a browsing session</li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">5. How Long Do Cookies Last?</h2>
              <ul className="list-disc pl-6 space-y-3 text-gray-300">
                <li><span className="text-white font-medium">Session Cookies:</span> Deleted when you close your browser</li>
                <li><span className="text-white font-medium">Persistent Cookies:</span> Remain on your device for a set period (ranging from days to years) or until you delete them</li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">6. Managing Your Cookie Preferences</h2>
              <p className="text-gray-300 leading-relaxed mb-4">You can control and manage cookies in several ways:</p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-200">6.1 Browser Settings</h3>
              <p className="text-gray-300 leading-relaxed mb-3">Most browsers allow you to control cookies through settings. You can typically:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>View and delete cookies</li>
                <li>Block all cookies</li>
                <li>Block third-party cookies only</li>
                <li>Accept or reject cookies on a site-by-site basis</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-200">6.2 Opt-Out Links</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li><span className="text-white font-medium">Google Analytics:</span> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://tools.google.com/dlpage/gaoptout</a></li>
                <li><span className="text-white font-medium">Network Advertising Initiative:</span> <a href="https://optout.networkadvertising.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://optout.networkadvertising.org</a></li>
                <li><span className="text-white font-medium">Digital Advertising Alliance:</span> <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://optout.aboutads.info</a></li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">7. Impact of Disabling Cookies</h2>
              <p className="text-gray-300 leading-relaxed mb-4">If you choose to disable cookies, please note that some features of our website may not function properly. This may include:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Inability to stay logged in</li>
                <li>Loss of saved preferences</li>
                <li>Reduced website functionality</li>
                <li>Degraded user experience</li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">8. Do Not Track Signals</h2>
              <p className="text-gray-300 leading-relaxed">Some browsers have a "Do Not Track" feature that signals websites not to track your online activity. We currently do not respond to Do Not Track signals, but you can manage tracking through cookie settings as described above.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">9. Changes to This Cookie Policy</h2>
              <p className="text-gray-300 leading-relaxed">We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. We will post any changes on this page with an updated "Last updated" date.</p>

              <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">10. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">If you have questions about our use of cookies or this policy, please contact us:</p>
              <div className="bg-surface p-6 rounded-lg border border-border/50">
                <p className="text-white font-medium">SergioAvedian.com</p>
                <p className="text-gray-300 mt-1">Email: <a href="mailto:sergio@sergioavedian.com" className="text-primary hover:underline">sergio@sergioavedian.com</a></p>
              </div>

              <p className="text-gray-400 text-sm mt-10 pt-6 border-t border-border/30">
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
