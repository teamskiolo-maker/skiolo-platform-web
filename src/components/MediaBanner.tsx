import { BookOpen, Users } from "lucide-react";
import React from "react";

interface MediaBannerProps {
  imageUrl?: string | null;
  title: string;
  variant?: "course" | "workshop";
  className?: string;
}

export function MediaBanner({ imageUrl, title, variant = "course", className = "" }: MediaBannerProps) {
  const isImageValid = typeof imageUrl === "string" && imageUrl.trim().length > 0;

  if (isImageValid) {
    return (
      <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={imageUrl} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover" 
        />
      </div>
    );
  }

  // Placeholder state
  const Icon = variant === "course" ? BookOpen : Users;
  
  return (
    <div className={`relative overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-[#0A2350] to-[#0E2F66] text-white ${className}`}>
      {/* Decorative accent dots */}
      <div className="absolute top-4 left-4 flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-green/80" />
        <div className="w-1.5 h-1.5 rounded-full bg-accent-amber/80" />
        <div className="w-1.5 h-1.5 rounded-full bg-accent-coral/80" />
      </div>
      
      {/* Subtle background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-32 h-32 bg-white/5 rounded-full blur-2xl" />
      </div>

      <div className="flex flex-col items-center gap-3 p-4 text-center z-10">
        <Icon className="w-12 h-12 text-white/30" strokeWidth={1.5} />
        <span className="text-xs font-semibold tracking-wider uppercase text-white/50 line-clamp-1 max-w-[80%]">
          {title || "Untitled"}
        </span>
      </div>
    </div>
  );
}
