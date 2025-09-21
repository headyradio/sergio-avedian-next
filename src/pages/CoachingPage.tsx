import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Target, Calendar, CheckCircle, Clock, Star, Award } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import WebinarCard from "@/components/WebinarCard";
import PersonalCoachingSection from "@/components/PersonalCoachingSection";

const CoachingPage = () => {
  const courses = [
    {
      id: "options-mastery",
      title: "Options Trading Mastery",
      description: "Master advanced derivatives and structured products with 35+ years of Wall Street expertise.",
      price: 497,
      duration: "12 weeks",
      image: "/src/assets/options-trading.jpg",
      outcomes: [
        "Advanced options strategies",
        "Risk management techniques",
        "Market timing principles",
        "Psychology of derivatives trading"
      ]
    },
    {
      id: "market-psychology",
      title: "Market Psychology & Discipline",
      description: "Develop emotional resilience and mental discipline for consistent trading success.",
      price: 297,
      duration: "8 weeks",
      image: "/src/assets/trading-psychology.jpg",
      outcomes: [
        "Emotional control techniques",
        "Discipline frameworks",
        "Stress management",
        "Decision-making under pressure"
      ]
    },
    {
      id: "risk-management",
      title: "Risk Management Essentials",
      description: "Learn hard-earned lessons from navigating multiple market cycles and downturns.",
      price: 197,
      duration: "6 weeks",
      image: "/src/assets/long-term-investing.jpg",
      outcomes: [
        "Position sizing strategies",
        "Portfolio protection",
        "Downside risk mitigation",
        "Capital preservation"
      ]
    },
    {
      id: "wealth-building",
      title: "Long-Term Wealth Building",
      description: "Fundamentals for lasting financial success and generational wealth creation.",
      price: 147,
      duration: "4 weeks",
      image: "/src/assets/active-passive-investing.jpg",
      outcomes: [
        "Investment frameworks",
        "Compound growth strategies",
        "Tax optimization",
        "Estate planning basics"
      ]
    }
  ];

  const webinars = [
    {
      id: "market-cycles",
      title: "Navigating Market Cycles: Lessons from 35 Years",
      date: "Oct 28, 2024",
      time: "2:00 PM ET",
      duration: "90 minutes",
      price: 97,
      isUpcoming: true,
      description: "Learn how to identify and profit from different market phases based on decades of experience."
    },
    {
      id: "options-strategies",
      title: "Options Strategies for All Market Conditions", 
      date: "Nov 15, 2024",
      time: "7:00 PM ET",
      duration: "60 minutes",
      price: 67,
      isUpcoming: true,
      description: "Discover versatile options strategies that work in bull, bear, and sideways markets."
    },
    {
      id: "trading-discipline",
      title: "Building Mental Discipline in Trading",
      date: "Dec 5, 2024",
      time: "1:00 PM ET", 
      duration: "75 minutes",
      price: 77,
      isUpcoming: true,
      description: "Master the psychological aspects of trading that separate winners from losers."
    }
  ];

  const testimonials = [
    {
      name: "Michael R.",
      role: "Portfolio Manager",
      content: "Sergio's mentorship transformed my approach to risk management. His 35 years of experience shows in every lesson.",
      rating: 5
    },
    {
      name: "Sarah T.", 
      role: "Individual Trader",
      content: "The psychology course changed everything. I went from emotional trading to disciplined execution.",
      rating: 5
    },
    {
      name: "David L.",
      role: "Investment Advisor",
      content: "Real-world strategies from someone who's actually been through multiple market cycles. Invaluable insights.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-background/95 to-muted/20 overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-grid-pattern"></div>
        </div>
        
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl"></div>
        
        <div className="editorial-container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Wall Street Veteran • Proven Track Record</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Transform Your Trading with 
              <span className="text-gradient block mt-2">35+ Years of Wall Street Expertise</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Learn from a seasoned professional who has navigated multiple market cycles. 
              Master proven strategies, develop mental discipline, and build lasting wealth through personalized coaching and comprehensive courses.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">35+</div>
                <div className="text-sm text-text-secondary">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-text-secondary">Students Coached</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-sm text-text-secondary">Success Rate</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Button size="lg" className="cta-electric text-lg px-8 py-4">
                <Users className="w-5 h-5 mr-2" />
                View Courses
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <Target className="w-5 h-5 mr-2" />
                Book 1-on-1 Coaching
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 bg-surface/50">
        <div className="editorial-container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="mb-4">Comprehensive Training</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Master the Markets with Proven Strategies
            </h2>
            <p className="text-lg text-text-secondary">
              Comprehensive courses designed from 35+ years of Wall Street experience. 
              Learn practical strategies, risk management, and the psychology of successful trading.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Personal Coaching Section */}
      <PersonalCoachingSection />

      {/* Webinars Section */}
      <section className="py-20">
        <div className="editorial-container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="mb-4">Live Training</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Upcoming Live Webinars
            </h2>
            <p className="text-lg text-text-secondary">
              Join interactive sessions where you can learn directly from Sergio and ask questions in real-time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {webinars.map((webinar) => (
              <WebinarCard key={webinar.id} webinar={webinar} />
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-surface/50">
        <div className="editorial-container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="mb-4">Success Stories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              What Students Are Saying
            </h2>
            <p className="text-lg text-text-secondary">
              Real results from real people who have transformed their trading with Sergio's guidance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-modern">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-text-secondary mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-text-muted">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="editorial-container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4">FAQ</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="space-y-8">
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle>What makes Sergio's coaching different?</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Sergio brings 35+ years of real Wall Street experience, having navigated multiple market cycles. 
                    His pay-it-forward philosophy ensures you get practical, battle-tested strategies rather than theory.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle>Are there refunds available?</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Yes, we offer a 30-day money-back guarantee on all courses. 
                    Personal coaching sessions have a 7-day satisfaction guarantee.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle>How much time do I need to commit?</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Courses range from 4-12 weeks with 2-3 hours per week recommended. 
                    Personal coaching is flexible and tailored to your schedule and goals.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CoachingPage;