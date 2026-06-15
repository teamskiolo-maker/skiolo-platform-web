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
  
  // Use a sleek, polished gradient
  const gradientClass = variant === "course" 
    ? "from-slate-100 to-slate-200 text-slate-500 border-slate-200" 
    : "from-indigo-50 to-slate-100 text-indigo-400 border-indigo-100";

  return (
    <div className={`relative overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br border ${gradientClass} ${className}`}>
      <div className="flex flex-col items-center gap-2 p-4 text-center">
        <Icon className="w-10 h-10 opacity-70" strokeWidth={1.5} />
        <span className="text-xs font-semibold tracking-wider uppercase opacity-60 line-clamp-1 max-w-[80%]">
          {title || "Untitled"}
        </span>
      </div>
    </div>
  );
}
