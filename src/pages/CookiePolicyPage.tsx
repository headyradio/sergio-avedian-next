import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const CookiePolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Cookie Policy - Sergio Avedian</title>
        <meta 
          name="description" 
          content="Cookie Policy for SergioAvedian.com - How we use cookies and similar technologies on our website." 
        />
        <link rel="canonical" href="/cookie-policy" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main className="pt-24 pb-16 lg:pt-32 lg:pb-20">
          <div className="editorial-container">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-8 text-text-primary">Cookie Policy</h1>
              
              <div className="prose prose-lg max-w-none text-text-secondary space-y-6">
                <p className="text-sm text-text-muted mb-6">Last updated: December 24, 2024</p>
                
                <p>This Cookie Policy explains how SergioAvedian.com uses cookies and similar technologies on our website and services. For more details about our data practices, see the Privacy Policy.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">What are cookies and similar technologies</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Cookies</strong> are small files stored on a device to remember settings and actions.</li>
                  <li><strong>Similar technologies</strong> include pixels, web beacons, local storage, and SDKs used for functionality, analytics, and, where applicable, advertising.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">How we use cookies</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Strictly necessary:</strong> enable core site functionality, security, login, subscription, checkout.</li>
                  <li><strong>Functional:</strong> remember preferences (e.g., language, cookie choices, saved settings, dark/light theme).</li>
                  <li><strong>Analytics/performance:</strong> measure traffic, page performance, and content effectiveness to improve user experience.</li>
                  <li><strong>Advertising/retargeting (if enabled):</strong> provide or measure ads and limit repetition. We minimize tracking, and any such use will be disclosed in the banner with controls.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Examples of data collected</h2>
                <p>Pages viewed, time on page, referral URLs, device/browser details, approximate location, and interactions with courses, webinars, and forms. We do not store full payment card data in cookies.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Managing your preferences</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Cookie banner:</strong> set or change preferences at any time via "Cookie Settings" in the footer.</li>
                  <li><strong>Browser/device controls:</strong> block or delete cookies in settings; functionality may be limited if strictly necessary cookies are disabled.</li>
                  <li><strong>Analytics opt‑outs:</strong> use tools such as Google's opt‑out add‑on (if applicable) or adjust permissions in "Cookie Settings."</li>
                  <li><strong>Ads opt‑outs:</strong> visit industry sites like aboutads.info/choices and youradchoices.ca/choices (where available) or use platform settings.</li>
                  <li><strong>Global Privacy Control (GPC):</strong> we endeavor to honor GPC signals supported by your browser for applicable opt‑out rights.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Retention</h2>
                <p>Cookies persist for session or persistent periods depending on their function. We aim to limit retention to what is necessary for the stated purposes.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Updates to this policy</h2>
                <p>We may update this Cookie Policy to reflect changes in technology, law, or our practices. Material updates will be posted with a new "Last updated" date.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Contact</h2>
                <p>For questions or requests related to cookies or tracking technologies, contact us at:</p>
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

export default CookiePolicyPage;