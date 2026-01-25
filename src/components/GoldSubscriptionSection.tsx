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
      <section className="py-12">
        <div className="editorial-container">
          <Card className="overflow-hidden bg-gradient-to-br from-amber-950/30 to-yellow-900/20 border-amber-800/30">
            <CardContent className="p-6 lg:p-8">
              {/* Compact Header Row */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg shrink-0">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-text-primary">
                      Gold Membership
                    </h2>
                    <p className="text-sm text-text-secondary">
                      Exclusive access to Sergio's trading community
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-2xl font-bold text-text-primary">
                      $9.99
                    </span>
                    <span className="text-sm text-text-muted">/month</span>
                  </div>
                  <Button
                    onClick={handleJoinMembership}
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold px-6"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Join Now
                  </Button>
                </div>
              </div>

              {/* Benefits Grid - Compact */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-surface/50 border border-border/30"
                    >
                      <Icon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-text-primary leading-tight">
                          {benefit.title}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </TooltipProvider>
  );
};

export default GoldSubscriptionSection;
