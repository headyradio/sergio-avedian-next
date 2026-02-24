"use client";

import React from "react";

const MissionStatement = () => {

  return (
    <section className="section-spacing">
      <div className="editorial-container">
        <div className="max-w-3xl">
          {/* Label */}
          <span className="text-xs font-semibold tracking-[0.25em] text-primary uppercase mb-6 block">
            Mission
          </span>

          {/* Quote — serif, large, left-aligned */}
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-display italic text-text-primary leading-snug mb-8">
            "Financial freedom begins with financial literacy."
          </blockquote>

          {/* Body text — left-aligned, readable width */}
          <div className="space-y-5 text-text-secondary text-base lg:text-lg leading-relaxed max-w-[65ch]">
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
            <p className="font-medium text-text-primary">
              Financial literacy isn't about getting everything right — it's
              about having clarity, confidence, and control over your future.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionStatement;
