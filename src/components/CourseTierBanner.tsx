import React from "react";

export type CourseTier = "BASIC" | "STANDARD" | "PREMIUM";

interface CourseTierBannerProps {
  tier: CourseTier;
  className?: string;
}

export function CourseTierBanner({ tier, className = "" }: CourseTierBannerProps) {
  if (tier === "BASIC") {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#0E2F66] to-[#0A2350] flex items-center justify-center ${className}`}>
        {/* Subtle Faint Blueprint Grid */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
        {/* Minimal Accent Dots */}
        <div className="absolute top-4 left-4 flex gap-1">
          <div className="w-1.5 h-1.5 bg-[#2E73C9] rounded-sm opacity-80" />
        </div>
        {/* Abstract Geometry */}
        <svg className="w-24 h-24 text-white/5 absolute right-10 bottom-0 translate-y-1/3" viewBox="0 0 100 100" fill="currentColor">
          <rect x="0" y="0" width="100" height="100" />
        </svg>
        <span className="relative z-10 text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 border border-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
          BASIC
        </span>
      </div>
    );
  }

  if (tier === "STANDARD") {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#0A2350] to-[#081B40] group flex items-center justify-center ${className}`}>
        {/* Glow Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#16306B] rounded-full blur-[60px] opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700 ease-out" />
        {/* Network Pattern */}
        <div className="absolute inset-0 opacity-10 mix-blend-screen"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
        {/* Overlapping Squares */}
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
        <span className="relative z-10 text-[10px] font-bold tracking-[0.2em] uppercase text-[#3FB57A] border border-[#3FB57A]/30 bg-[#3FB57A]/10 px-3 py-1 rounded-full backdrop-blur-sm">
          STANDARD
        </span>
      </div>
    );
  }

  // PREMIUM
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-[#081B40] to-[#050D22] group flex items-center justify-center ${className}`}>
      {/* Intense Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#F2B53C]/10 rounded-full blur-[80px] group-hover:bg-[#F2B53C]/20 group-hover:scale-110 transition-all duration-700 ease-out" />
      
      {/* Subtle Gold Shimmer Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#F2B53C]/40 to-transparent opacity-50" />
      
      {/* Refined Nodes Constellation */}
      <svg className="absolute inset-0 w-full h-full opacity-20 group-hover:opacity-30 transition-opacity duration-700" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#F2B53C">
        <circle cx="100" cy="100" r="3" fill="#F2B53C" />
        <circle cx="200" cy="50" r="2" fill="#F2B53C" />
        <circle cx="300" cy="150" r="4" fill="#F2B53C" />
        <circle cx="350" cy="80" r="2" fill="#F2B53C" />
        <circle cx="50" cy="150" r="2" fill="#F2B53C" />
        <path d="M100 100 L200 50 L350 80 L300 150 L100 100 L50 150" strokeWidth="0.5" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
      </svg>
      
      {/* Concentric System Rings */}
      <svg className="w-48 h-48 text-[#F2B53C]/10 absolute -right-8 -bottom-10 group-hover:rotate-12 transition-transform duration-1000 ease-out" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="50" cy="50" r="40" />
        <circle cx="50" cy="50" r="30" strokeDasharray="2 2" />
        <circle cx="50" cy="50" r="20" />
        <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.5" />
      </svg>

      {/* Overlapping Accents */}
      <div className="absolute top-4 left-4 flex gap-1">
        <div className="w-2 h-2 bg-[#F2B53C] rounded-sm opacity-90 shadow-[0_0_8px_rgba(242,181,60,0.8)]" />
        <div className="w-2 h-2 bg-[#E8615A] rounded-sm opacity-80" />
        <div className="w-2 h-2 bg-[#3FB57A] rounded-sm opacity-80" />
      </div>

      <span className="relative z-10 text-[10px] font-bold tracking-[0.2em] uppercase text-[#F2B53C] border border-[#F2B53C]/30 bg-[#F2B53C]/10 px-4 py-1 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(242,181,60,0.2)]">
        PREMIUM
      </span>
    </div>
  );
}
