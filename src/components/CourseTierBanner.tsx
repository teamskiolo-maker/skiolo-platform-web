import React from "react";
import { BookOpen, Sparkles, Crown } from "lucide-react";

export type CourseTier = "BASIC" | "STANDARD" | "PREMIUM";

interface CourseTierBannerProps {
  tier: CourseTier;
  className?: string;
}

export function CourseTierBanner({ tier, className = "" }: CourseTierBannerProps) {
  if (tier === "BASIC") {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#0E2F66] to-[#0A2350] group flex items-center justify-center ${className}`}>
        {/* Subtle Faint Blueprint Grid */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
        {/* Minimal Accent Dots */}
        <div className="absolute top-4 left-4 flex gap-1">
          <div className="w-1.5 h-1.5 bg-[#2E73C9] rounded-sm opacity-80" />
        </div>
        
        {/* Central Emblem */}
        <div className="relative z-10 flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-500">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm mb-3">
            <BookOpen className="w-6 h-6 text-white/60" />
          </div>
        </div>

        {/* Abstract Geometry */}
        <svg className="w-24 h-24 text-white/5 absolute right-4 bottom-0 translate-y-1/3 group-hover:-translate-y-1 transition-transform duration-700" viewBox="0 0 100 100" fill="currentColor">
          <rect x="0" y="0" width="100" height="100" />
        </svg>
      </div>
    );
  }

  if (tier === "STANDARD") {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#0A2350] to-[#081B40] group flex items-center justify-center ${className}`}>
        {/* Glow Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#2E73C9] rounded-full blur-[70px] opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700 ease-out" />
        
        {/* Network Pattern */}
        <div className="absolute inset-0 opacity-10 mix-blend-screen"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
        
        {/* Central Emblem */}
        <div className="relative z-10 flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-[#2E73C9] blur-md opacity-40 rounded-full" />
            <div className="relative w-14 h-14 bg-[#0A2350]/80 border border-[#2E73C9]/40 shadow-[0_0_15px_rgba(46,115,201,0.3)] rounded-2xl flex items-center justify-center backdrop-blur-md mb-3">
              <Sparkles className="w-7 h-7 text-[#2E73C9]" />
            </div>
          </div>
        </div>

        {/* Overlapping Squares Accent */}
        <div className="absolute top-4 left-4 flex gap-1">
          <div className="w-2 h-2 bg-[#2E73C9] rounded-sm opacity-80" />
          <div className="w-2 h-2 bg-[#3FB57A] rounded-sm opacity-80" />
        </div>

        {/* Abstract Geometry */}
        <svg className="w-32 h-32 text-white/5 absolute -right-4 -bottom-4 group-hover:rotate-3 transition-transform duration-700 ease-out" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="10" y="10" width="40" height="40" />
          <rect x="30" y="30" width="40" height="40" />
          <line x1="50" y1="10" x2="30" y2="30" />
          <line x1="10" y1="50" x2="30" y2="70" />
        </svg>
      </div>
    );
  }

  // PREMIUM
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-[#081B40] to-[#050D22] group flex items-center justify-center ${className}`}>
      {/* Intense Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#F2B53C] rounded-full blur-[90px] opacity-15 group-hover:opacity-30 group-hover:scale-125 transition-all duration-1000 ease-out" />
      
      {/* Animated Shimmer Sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_ease-in-out_infinite] opacity-50" />
      
      {/* Subtle Gold Shimmer Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#F2B53C]/60 to-transparent opacity-70 shadow-[0_0_10px_rgba(242,181,60,0.8)]" />
      
      {/* Refined Nodes Constellation */}
      <svg className="absolute inset-0 w-full h-full opacity-20 group-hover:opacity-40 transition-opacity duration-700" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#F2B53C">
        <circle cx="100" cy="100" r="3" fill="#F2B53C" />
        <circle cx="200" cy="50" r="2" fill="#F2B53C" />
        <circle cx="300" cy="150" r="4" fill="#F2B53C" />
        <circle cx="350" cy="80" r="2" fill="#F2B53C" />
        <circle cx="50" cy="150" r="2" fill="#F2B53C" />
        <path d="M100 100 L200 50 L350 80 L300 150 L100 100 L50 150" strokeWidth="0.5" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
      </svg>
      
      {/* Central Emblem - Crown */}
      <div className="relative z-10 flex flex-col items-center justify-center group-hover:scale-110 transition-transform duration-700">
        <div className="relative">
          {/* Halo */}
          <div className="absolute inset-0 bg-[#F2B53C] blur-xl opacity-30 rounded-full group-hover:opacity-50 transition-opacity duration-700" />
          <div className="relative w-16 h-16 bg-gradient-to-b from-[#182B4D] to-[#0A1630] border border-[#F2B53C]/40 shadow-[0_0_25px_rgba(242,181,60,0.25)] rounded-2xl flex items-center justify-center backdrop-blur-xl mb-3 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F2B53C]/20 to-transparent opacity-50" />
            <Crown className="w-8 h-8 text-[#F2B53C] drop-shadow-md z-10" />
          </div>
        </div>
      </div>

      {/* Concentric System Rings */}
      <svg className="w-56 h-56 text-[#F2B53C]/15 absolute -right-12 -bottom-16 group-hover:rotate-12 group-hover:scale-105 transition-all duration-1000 ease-out" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="50" cy="50" r="40" />
        <circle cx="50" cy="50" r="30" strokeDasharray="2 2" />
        <circle cx="50" cy="50" r="20" />
        <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.5" />
      </svg>

      {/* Overlapping Accents */}
      <div className="absolute top-4 left-4 flex gap-1 z-10">
        <div className="w-2.5 h-2.5 bg-gradient-to-br from-[#F2B53C] to-[#C99120] rounded-sm shadow-[0_0_8px_rgba(242,181,60,0.8)]" />
        <div className="w-2.5 h-2.5 bg-gradient-to-br from-[#E8615A] to-[#C24943] rounded-sm opacity-90" />
        <div className="w-2.5 h-2.5 bg-gradient-to-br from-[#3FB57A] to-[#2E8B5B] rounded-sm opacity-90" />
      </div>
    </div>
  );
}
