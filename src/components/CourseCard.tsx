import Link from "next/link";
import { CourseTierBanner, CourseTier } from "@/components/CourseTierBanner";
import { Button } from "@/components/ui/Button";
import { Star } from "lucide-react";
import { BulletList } from "@/components/BulletList";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  pricePaise: number;
  thumbnail?: string | null;
  isPublished?: boolean;
}

interface CourseCardProps {
  course: Course;
  tier?: CourseTier;
}

export function CourseCard({ course, tier = "BASIC" }: CourseCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(course.pricePaise / 100);

  const isPremium = tier === "PREMIUM";
  const isStandard = tier === "STANDARD";

  // Tier-specific styles
  const cardBorder = isPremium 
    ? "border-[#F2B53C]/40 ring-1 ring-[#F2B53C]/20 shadow-soft-lg scale-[1.02] z-10" 
    : isStandard
    ? "border-accent-blue/20 shadow-soft"
    : "border-line shadow-soft";

  const hoverEffect = isPremium
    ? "hover:shadow-xl hover:-translate-y-2 hover:border-[#F2B53C]/60 hover:ring-[#F2B53C]/40"
    : "hover:shadow-soft-lg hover:-translate-y-1";

  const badgeBg = isPremium 
    ? "bg-[#F2B53C] text-[#050D22] border-transparent shadow-[0_0_10px_rgba(242,181,60,0.3)]" 
    : isStandard
    ? "bg-[#2E73C9] text-white border-transparent"
    : "bg-[#0E2F66] text-white border-transparent";

  return (
    <Link href={`/courses/${course.slug}`} className={`group block h-full ${isPremium ? 'relative z-10' : ''}`}>
      <div className={`relative h-full flex flex-col bg-paper-card border rounded-2xl2 overflow-hidden transition-all duration-300 ${cardBorder} ${hoverEffect}`}>
        {isPremium && (
          <div className="absolute top-3 right-3 z-20">
            <div className="bg-gradient-to-r from-[#F2B53C] to-[#C99120] text-[#050D22] text-[10px] font-bold tracking-widest uppercase py-1.5 px-4 rounded-full shadow-lg border border-white/20 flex items-center gap-1.5">
              <Star className="w-3 h-3 fill-[#050D22]" />
              FLAGSHIP
            </div>
          </div>
        )}
        
        <CourseTierBanner 
          tier={tier} 
          className="w-full aspect-video" 
        />
        
        <div className="p-6 flex flex-col flex-1 relative">
          <div className="flex items-start justify-between mb-3 gap-3">
            <h2 className="text-xl font-display font-semibold text-ink tracking-tight2 line-clamp-2 group-hover:text-navy transition-colors">
              {course.title}
            </h2>
          </div>
          
          <div className="mb-4">
             <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${badgeBg}`}>
              {tier} TIER
            </span>
          </div>

          <div className="mb-6 flex-1">
            <BulletList 
              text={course.description} 
              maxItems={3} 
              className="text-sm" 
              itemClassName="line-clamp-1" 
            />
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-line/50 mt-auto">
            <span className={`font-display font-bold text-xl ${isPremium ? "text-[#F2B53C] drop-shadow-sm" : "text-navy"}`}>
              {formattedPrice}
            </span>
            <Button variant={isPremium ? "primary" : "secondary"} size="sm" className="pointer-events-none group-hover:bg-navy-hover group-hover:text-white group-hover:border-transparent">
              View course
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
