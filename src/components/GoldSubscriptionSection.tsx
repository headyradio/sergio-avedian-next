import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Crown, Badge, Video, Users, Clock, Info } from "lucide-react";

const GoldSubscriptionSection = () => {
  const benefits = [
    {
      icon: Badge,
      title: "Loyalty Badges",
      description: "Get exclusive badges next to your name in comments and live chat"
    },
    {
      icon: Video,
      title: "Members-Only Live Streams",
      description: "Access 2-4 additional monthly member-only live streams"
    },
    {
      icon: Clock,
      title: "Live Stream Replays",
      description: "Watch past member-only live streams with full replay access"
    },
    {
      icon: Users,
      title: "Private Telegram Chat Group Access",
      description: "My Telegram chat group is like personal mentorship in a group setting.",
      hasTooltip: true,
      tooltipText: "Access to Telegram group is granted manually once membership has been activated."
    }
  ];

  const handleJoinMembership = () => {
    window.open("https://www.youtube.com/channel/UCAqOtdXGhmq57ztQQw2TQqQ/join", "_blank", "noopener,noreferrer");
  };

  return (
    <TooltipProvider>
      <section className="py-16">
        <div className="editorial-container">
        <Card className="card-modern overflow-hidden bg-gradient-to-br from-amber-50/50 to-yellow-100/30 dark:from-amber-950/20 dark:to-yellow-900/10 border-amber-200/50 dark:border-amber-800/30">
          <CardContent className="p-6 sm:p-8 lg:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full mb-4">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-gradient mb-4">
                Gold Membership
              </h2>
              <div className="flex items-center justify-center mb-6">
                <span className="text-4xl lg:text-5xl font-black text-text-primary">$9.99</span>
                <span className="text-xl text-text-secondary ml-2">/month</span>
              </div>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Join an exclusive community of serious traders and get direct access to Sergio's 35+ years of Wall Street expertise.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-card/50 border border-card-border/50">
                    <div className="flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg shrink-0">
                      <Icon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-text-primary">
                          {benefit.title}
                        </h3>
                        {benefit.hasTooltip && (
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-text-secondary hover:text-text-primary transition-colors" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs max-w-48">{benefit.tooltipText}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <Button 
                onClick={handleJoinMembership}
                size="lg"
                className="w-full sm:w-auto min-h-[48px] bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold px-6 sm:px-8 py-3 text-base sm:text-lg"
              >
                <Crown className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">Join Gold Membership</span>
                <span className="sm:hidden">Join Gold</span>
              </Button>
              <p className="text-xs sm:text-sm text-text-muted mt-4">
                Managed through YouTube • Cancel anytime
              </p>
            </div>
          </CardContent>
        </Card>
        </div>
      </section>
    </TooltipProvider>
  );
};

export default GoldSubscriptionSection;