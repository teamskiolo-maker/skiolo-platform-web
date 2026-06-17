import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Users, Video, MapPin, Calendar, Clock, Globe } from "lucide-react";
import { BulletList } from "@/components/BulletList";

interface Workshop {
  id: string;
  title: string;
  slug: string;
  description: string;
  pricePaise: number;
  mode: "ONLINE" | "OFFLINE";
  startsAt: string;
  thumbnail?: string | null;
}

interface WorkshopCardProps {
  workshop: Workshop;
}

export function WorkshopBanner({ mode, className = "" }: { mode: "ONLINE" | "OFFLINE", className?: string }) {
  if (mode === "ONLINE") {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#0A2350] to-[#081B40] group flex items-center justify-center ${className}`}>
        {/* Abstract Signal/Network for Online */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-plus-lighter"
          style={{
            backgroundImage: `linear-gradient(#2E73C9 1px, transparent 1px), linear-gradient(90deg, #2E73C9 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#2E73C9] rounded-full blur-[70px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 ease-out" />
        
        <svg className="w-full h-full absolute inset-0 opacity-20 group-hover:scale-105 transition-transform duration-1000 ease-out" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#2E73C9" strokeWidth="1">
          <circle cx="200" cy="100" r="30" strokeDasharray="4 4" className="animate-[spin_20s_linear_infinite]" />
          <circle cx="200" cy="100" r="50" opacity="0.6" />
          <circle cx="200" cy="100" r="80" opacity="0.3" strokeDasharray="2 6" />
          <path d="M50 100 Q 200 50 350 100" strokeDasharray="4 4" opacity="0.5" />
          <path d="M50 100 Q 200 150 350 100" strokeDasharray="4 4" opacity="0.5" />
        </svg>

        <div className="relative z-10 flex flex-col items-center justify-center group-hover:scale-110 transition-transform duration-500">
          <div className="w-16 h-16 bg-[#0A2350]/60 border border-[#2E73C9]/40 rounded-2xl shadow-[0_0_20px_rgba(46,115,201,0.2)] flex items-center justify-center backdrop-blur-md mb-3">
            <Globe className="w-8 h-8 text-[#2E73C9]" />
          </div>
          <span className="font-display font-bold tracking-[0.2em] text-[#2E73C9] text-[10px] uppercase bg-[#2E73C9]/10 px-3 py-1 rounded-full border border-[#2E73C9]/20">
            ONLINE
          </span>
        </div>
      </div>
    );
  }

  // OFFLINE
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-[#081B40] to-[#050D22] group flex items-center justify-center ${className}`}>
      {/* Abstract Room/Space for Offline */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[#F2B53C] to-[#3FB57A] rounded-full blur-[80px] opacity-15 group-hover:opacity-30 transition-opacity duration-700 ease-out" />
      
      <svg className="w-full h-full absolute inset-0 opacity-20 group-hover:scale-105 transition-transform duration-1000 ease-out" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" fill="none" strokeWidth="1">
        <rect x="120" y="40" width="160" height="120" rx="15" stroke="#F2B53C" strokeDasharray="4 4" />
        <rect x="100" y="20" width="200" height="160" rx="20" stroke="#3FB57A" opacity="0.3" />
        <path d="M0 200 L120 160 M400 200 L280 160 M0 0 L120 40 M400 0 L280 40" stroke="#F2B53C" opacity="0.3" />
        <circle cx="200" cy="100" r="4" fill="#F2B53C" />
      </svg>

      <div className="relative z-10 flex flex-col items-center justify-center group-hover:scale-110 transition-transform duration-500">
        <div className="w-16 h-16 bg-[#050D22]/60 border border-[#F2B53C]/40 rounded-2xl shadow-[0_0_20px_rgba(242,181,60,0.2)] flex items-center justify-center backdrop-blur-md mb-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F2B53C]/20 to-transparent opacity-50" />
          <MapPin className="w-8 h-8 text-[#F2B53C] z-10" />
        </div>
        <span className="font-display font-bold tracking-[0.2em] text-[#F2B53C] text-[10px] uppercase bg-[#F2B53C]/10 px-3 py-1 rounded-full border border-[#F2B53C]/20">
          IN-PERSON
        </span>
      </div>
    </div>
  );
}

export function WorkshopCard({ workshop }: WorkshopCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(workshop.pricePaise / 100);

  const formatIST = (dateString: string) => {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(dateString));
  };

  const isOnline = workshop.mode === "ONLINE";
  const badgeColors = isOnline 
    ? "bg-accent-blue/10 text-accent-blue border-accent-blue/20" 
    : "bg-[#F2B53C]/10 text-[#F2B53C] border-[#F2B53C]/20";

  return (
    <Link href={`/workshops/${workshop.slug}`} className="group block h-full">
      <div className="h-full flex flex-col md:flex-row bg-paper-card border border-line rounded-2xl2 overflow-hidden shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300">
        
        {/* Banner Side */}
        <div className="w-full md:w-2/5 shrink-0 relative overflow-hidden">
          {workshop.thumbnail ? (
             <img src={workshop.thumbnail} alt={workshop.title} className="w-full h-full object-cover min-h-[240px]" />
          ) : (
            <WorkshopBanner mode={workshop.mode} className="w-full h-full min-h-[240px] md:min-h-full group-hover:scale-105 transition-transform duration-700 ease-out" />
          )}
        </div>

        {/* Details Side */}
        <div className="p-8 md:p-10 flex flex-col flex-1 relative">
          <div className="flex flex-wrap items-start justify-between mb-4 gap-4">
            <h2 className="text-2xl font-display font-bold text-ink tracking-tight2 line-clamp-2 group-hover:text-navy transition-colors">
              {workshop.title}
            </h2>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border shrink-0 ${badgeColors}`}>
              {workshop.mode}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-6">
            <div className="flex items-center gap-2 text-ink-muted text-sm font-medium">
              <Calendar className="w-4 h-4 text-navy/60" />
              {formatIST(workshop.startsAt).split(',')[0] + ',' + formatIST(workshop.startsAt).split(',')[1]}
            </div>
            <div className="flex items-center gap-2 text-ink-muted text-sm font-medium">
              <Clock className="w-4 h-4 text-navy/60" />
              {formatIST(workshop.startsAt).split(',')[2] || formatIST(workshop.startsAt)} {/* Fallback */}
            </div>
          </div>

          <div className="mb-8 flex-1">
            <BulletList 
              text={workshop.description} 
              maxItems={3} 
              className="text-base" 
              itemClassName="line-clamp-1" 
            />
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-line/50 mt-auto">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-1">Registration</span>
              <span className="font-display font-bold text-2xl text-navy">
                {formattedPrice}
              </span>
            </div>
            <Button variant="primary" size="lg" className="pointer-events-none shadow-sm group-hover:bg-navy-hover group-hover:shadow-md transition-all">
              View / Book
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
