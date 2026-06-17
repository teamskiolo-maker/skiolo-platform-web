import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Users, Video, MapPin, Calendar, Clock } from "lucide-react";

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

function WorkshopBanner({ mode, className = "" }: { mode: "ONLINE" | "OFFLINE", className?: string }) {
  if (mode === "ONLINE") {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#0A2350] to-[#081B40] flex items-center justify-center ${className}`}>
        {/* Abstract Web/Grid for Online */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-plus-lighter"
          style={{
            backgroundImage: `linear-gradient(#2E73C9 1px, transparent 1px), linear-gradient(90deg, #2E73C9 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#2E73C9] rounded-full blur-[70px] opacity-20" />
        <svg className="w-full h-full absolute inset-0 opacity-20" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#2E73C9" strokeWidth="1">
          <circle cx="200" cy="100" r="40" strokeDasharray="4 4" />
          <circle cx="200" cy="100" r="60" opacity="0.5" />
          <line x1="200" y1="0" x2="200" y2="200" opacity="0.3" />
          <line x1="0" y1="100" x2="400" y2="100" opacity="0.3" />
        </svg>
        <div className="z-10 bg-[#081B40]/40 backdrop-blur-md border border-[#2E73C9]/30 p-4 rounded-xl shadow-lg flex items-center gap-3">
          <Video className="w-6 h-6 text-[#2E73C9]" />
          <span className="font-display font-bold tracking-widest text-[#2E73C9] text-sm uppercase">Online Interactive</span>
        </div>
      </div>
    );
  }

  // OFFLINE
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-[#081B40] to-[#050D22] flex items-center justify-center ${className}`}>
      {/* Abstract Room/Space for Offline */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-[#F2B53C]/10 rounded-full blur-[80px]" />
      <svg className="w-full h-full absolute inset-0 opacity-20" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#F2B53C" strokeWidth="1">
        <rect x="150" y="50" width="100" height="100" rx="10" strokeDasharray="4 4" />
        <rect x="130" y="30" width="140" height="140" rx="15" opacity="0.3" />
        <path d="M0 200 L150 150 M400 200 L250 150 M0 0 L150 50 M400 0 L250 50" opacity="0.3" />
      </svg>
      <div className="z-10 bg-[#050D22]/40 backdrop-blur-md border border-[#F2B53C]/30 p-4 rounded-xl shadow-lg flex items-center gap-3">
        <MapPin className="w-6 h-6 text-[#F2B53C]" />
        <span className="font-display font-bold tracking-widest text-[#F2B53C] text-sm uppercase">In-Person Workshop</span>
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

          <p className="text-base text-ink-soft font-sans line-clamp-3 mb-8 flex-1 leading-relaxed">
            {workshop.description}
          </p>

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
