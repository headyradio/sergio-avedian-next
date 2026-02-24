"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Crown, Badge, Video, Users, Clock, Info } from "lucide-react";

const GoldSubscriptionSection = () => {

  const benefits = [
    {
      icon: Badge,
      title: "Loyalty Badges",
      description:
        "Get exclusive badges next to your name in comments and live chat",
    },
    {
      icon: Video,
      title: "Members-Only Live Streams",
      description: "Access 2-4 additional monthly member-only live streams",
    },
    {
      icon: Clock,
      title: "Live Stream Replays",
      description:
        "Watch past member-only live streams with full replay access",
    },
    {
      icon: Users,
      title: "Private Telegram Chat Group Access",
      description:
        "My Telegram chat group is like personal mentorship in a group setting.",
    },
  ];

  const handleJoinMembership = () => {
    window.open(
      "https://www.youtube.com/channel/UCAqOtdXGhmq57ztQQw2TQqQ/join",
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <TooltipProvider>
      <section className="section-spacing section-cream">
        <div className="editorial-container">
          <div>
            <Card className="overflow-hidden bg-white border-slate-200/60 shadow-lg shadow-black/5">
              <CardContent className="p-8 lg:p-12">
                {/* Header Row */}
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8 mb-10">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                    <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-lg shrink-0">
                      <Crown className="h-6 w-6 sm:h-7 sm:w-7 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="text-2xl lg:text-3xl font-display text-slate-900">
                        Gold Membership
                      </h2>
                      <p className="text-sm text-slate-600 mt-1">
                        Exclusive access to Sergio's trading community
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-xl sm:rounded-none border sm:border-transparent border-slate-100/80">
                    <div className="text-left sm:text-right flex items-baseline sm:block">
                      <span className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
                        $9.99
                      </span>
                      <span className="text-sm sm:text-base text-slate-500 ml-1">/month</span>
                    </div>
                    <Button
                      onClick={handleJoinMembership}
                      className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-8 py-6 sm:py-3 text-base"
                      aria-label="Join Sergio Avedian's Gold Membership for $9.99 per month"
                    >
                      <Crown className="h-4 w-4 mr-2" aria-hidden="true" />
                      Join Now
                    </Button>
                  </div>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:bg-white"
                      >
                        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1.5">
                            {benefit.title}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed font-medium">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
};

export default GoldSubscriptionSection;
