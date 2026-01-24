"use client";

import React from "react";

const MissionStatement = () => {
  return (
    <div className="container mx-auto px-4 mb-12 lg:mb-20">
      <div className="max-w-4xl mx-auto text-center bg-card/40 border border-primary/10 rounded-2xl p-8 backdrop-blur-sm shadow-sm relative overflow-hidden">
        {/* Decorative gradient blob */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          <h3 className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-4 opacity-80">
            Mission Statement
          </h3>

          <p className="text-xl md:text-2xl font-serif italic text-foreground mb-6">
            "Financial freedom begins with financial literacy."
          </p>

          <div className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            <p>
              My mission is to empower people to take ownership of their
              financial lives by giving them the knowledge, tools, and clarity
              to make confident decisions in an increasingly complex economy.
            </p>
            <p>
              Through practical, real-world education, I aim to reduce financial
              stress, expand opportunity, and help individuals build lasting
              independence, resilience, and long-term optionality.
            </p>
            <p className="font-medium text-foreground pt-2 not-italic">
              Financial literacy isn’t about getting everything right, it’s
              about having clarity, confidence, and control over your future.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionStatement;
