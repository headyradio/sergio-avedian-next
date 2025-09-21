import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Phone, FileText, TrendingUp, Shield } from "lucide-react";

const PersonalCoachingSection = () => {
  const features = [
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Personal Strategy Development",
      description: "Custom investment strategies tailored to your goals and risk tolerance"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Portfolio Review & Analysis",
      description: "Deep dive analysis of your current holdings with optimization recommendations"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Direct Phone Access",
      description: "Unlimited phone and email support during market hours"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Custom Market Analysis",
      description: "Personalized market insights and trade recommendations based on current conditions"
    }
  ];

  const packages = [
    {
      name: "Single Session",
      price: 750,
      duration: "90 minutes",
      description: "Perfect for specific questions or portfolio review",
      features: [
        "1-on-1 video consultation",
        "Portfolio analysis",
        "Custom action plan",
        "Follow-up email summary"
      ],
      popular: false
    },
    {
      name: "Monthly Mentorship",
      price: 2500,
      duration: "4 sessions + support",
      description: "Ongoing guidance and accountability",
      features: [
        "4 x 60-minute sessions",
        "Unlimited email support",
        "Custom strategy development",
        "Portfolio monitoring",
        "Market alerts & insights"
      ],
      popular: true
    },
    {
      name: "Quarterly Intensive",
      price: 6500,
      duration: "12 weeks comprehensive",
      description: "Complete transformation program",
      features: [
        "12 x 60-minute sessions",
        "Daily market commentary",
        "Custom trading plan",
        "Risk management framework",
        "Psychology coaching",
        "Direct phone access"
      ],
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-surface/30 to-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-brand-accent/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="editorial-container relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Crown className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Premium Coaching</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            One-on-One
            <span className="text-gradient block">Personalized Coaching</span>
          </h2>
          
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Get direct access to Sergio's 35+ years of Wall Street expertise. 
            Receive personalized advice, custom strategies, and ongoing support tailored to your unique goals and interests in investing.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="card-premium text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coaching Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => (
            <Card key={index} className={`${pkg.popular ? 'card-premium ring-2 ring-primary/20' : 'card-modern'} h-full flex flex-col relative`}>
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl mb-2">{pkg.name}</CardTitle>
                <div className="text-3xl font-bold text-primary mb-2">
                  ${pkg.price.toLocaleString()}
                </div>
                <CardDescription className="text-sm text-text-muted">
                  {pkg.duration}
                </CardDescription>
                <CardDescription className="text-base text-text-secondary mt-2">
                  {pkg.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className={`w-full ${pkg.popular ? 'cta-electric' : ''}`}
                  variant={pkg.popular ? "default" : "outline"}
                  size="lg"
                >
                  {pkg.popular ? 'Start Coaching' : 'Book Session'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="card-premium max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to Transform Your Trading?
              </h3>
              <p className="text-text-secondary mb-6">
                Schedule a complimentary 15-minute consultation to discuss your goals 
                and see if personal coaching is right for you.
              </p>
              <Button size="lg" className="cta-electric">
                <Phone className="w-5 h-5 mr-2" />
                Book Free Consultation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PersonalCoachingSection;