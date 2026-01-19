import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 px-6">
          <h1 className="text-6xl font-bold text-gradient">404</h1>
          <h2 className="text-2xl font-semibold text-text-primary">
            Page Not Found
          </h2>
          <p className="text-text-secondary max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-lg cta-electric text-cta-foreground font-medium transition-all hover:scale-105"
          >
            Return Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
