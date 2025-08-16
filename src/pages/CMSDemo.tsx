import Navigation from "@/components/Navigation";
import CMSHeroSection from "@/components/CMSHeroSection";
import CMSBlogSection from "@/components/CMSBlogSection";
import Footer from "@/components/Footer";
import { useTestBlogPost } from "@/hooks/useCMS";

const CMSDemo = () => {
  const { data: testBlogPost, isLoading: testLoading, error: testError } = useTestBlogPost();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hygraph Connection Test Section */}
      <div className="bg-yellow-50 border-b border-yellow-200 py-4">
        <div className="container mx-auto px-4">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            🧪 Hygraph Connection Test
          </h2>
          <div className="text-sm">
            {testLoading && <p className="text-yellow-700">Testing connection to Hygraph...</p>}
            {testError && (
              <div className="text-red-700">
                <p className="font-medium">❌ Connection failed:</p>
                <pre className="mt-1 text-xs bg-red-100 p-2 rounded overflow-auto">
                  {JSON.stringify(testError, null, 2)}
                </pre>
              </div>
            )}
            {testBlogPost && (
              <div className="text-green-700">
                <p className="font-medium">✅ Successfully connected! Found your blog post:</p>
                <div className="mt-1 text-xs bg-green-100 p-2 rounded">
                  <p><strong>ID:</strong> {testBlogPost.blogPost?.id || 'Not found'}</p>
                  <p><strong>Title:</strong> {testBlogPost.blogPost?.title || 'Not found'}</p>
                  <p><strong>Published:</strong> {testBlogPost.blogPost?.publishedAt || 'Not found'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <CMSHeroSection />
      <CMSBlogSection />
      <Footer />
    </div>
  );
};

export default CMSDemo;